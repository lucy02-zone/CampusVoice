require("dotenv").config();
const { Client } = require("pg");

const sourceUrl = process.env.DATABASE_URL;
const targetUrl = process.env.RENDER_DATABASE_URL;
if (!sourceUrl || !targetUrl) throw new Error("DATABASE_URL and RENDER_DATABASE_URL are required.");

const source = new Client({ connectionString: sourceUrl });
const target = new Client({ connectionString: targetUrl, ssl: { rejectUnauthorized: false } });
const tables = ["users", "posts", "complaints", "comments", "votes", "reports", "notifications", "complaint_responses"];
const maps = Object.fromEntries(tables.map((table) => [table, new Map()]));
const counts = Object.fromEntries(tables.map((table) => [table, { copied: 0, alreadyPresent: 0 }]));

const quote = (identifier) => `"${identifier.replaceAll('"', '""')}"`;
const stable = (value) => {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
};
const fingerprint = (row, fields) => JSON.stringify(fields.map((field) => stable(row[field] ?? null)));

async function rows(client, table) {
  return (await client.query(`SELECT * FROM public.${quote(table)} ORDER BY ${quote("id")}`)).rows;
}

async function insertRow(table, row, targetColumns) {
  const data = Object.fromEntries(Object.entries(row).filter(([key]) => key !== "id" && targetColumns.has(key)));
  const columns = Object.keys(data);
  const values = columns.map((key) => data[key]);
  const sql = `INSERT INTO public.${quote(table)} (${columns.map(quote).join(",")}) VALUES (${columns.map((_, i) => `$${i + 1}`).join(",")}) RETURNING id`;
  return (await target.query(sql, values)).rows[0].id;
}

async function tableColumns(table) {
  const [src, dst] = await Promise.all([
    source.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1", [table]),
    target.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name=$1", [table]),
  ]);
  const sourceColumns = new Set(src.rows.map((row) => row.column_name));
  const targetColumns = new Set(dst.rows.map((row) => row.column_name));
  if (!sourceColumns.size || !targetColumns.size) throw new Error(`Table ${table} is missing from one database.`);
  return { sourceColumns, targetColumns };
}

async function run() {
  await Promise.all([source.connect(), target.connect()]);
  try {
    await target.query("BEGIN");
    await target.query("SET CONSTRAINTS ALL DEFERRED");
    const schemas = {};
    for (const table of tables) schemas[table] = await tableColumns(table);

    const localUsers = await rows(source, "users");
    const remoteUsers = await rows(target, "users");
    const usersByEmail = new Map(remoteUsers.map((user) => [user.email.toLowerCase(), user]));
    const usedHandles = new Set(remoteUsers.map((user) => user.anonymousHandle).filter(Boolean));
    for (const user of localUsers) {
      const existing = usersByEmail.get(user.email.toLowerCase());
      if (existing) {
        maps.users.set(user.id, existing.id);
        counts.users.alreadyPresent++;
        continue;
      }
      const data = { ...user };
      if (data.anonymousHandle && usedHandles.has(data.anonymousHandle)) data.anonymousHandle = null;
      const id = await insertRow("users", data, schemas.users.targetColumns);
      maps.users.set(user.id, id);
      usersByEmail.set(user.email.toLowerCase(), { ...data, id });
      if (data.anonymousHandle) usedHandles.add(data.anonymousHandle);
      counts.users.copied++;
    }

    const taskDefinitions = [
      { table: "posts", parents: { userId: "users" }, key: ["userId", "anonymousId", "title", "content", "category", "createdAt"] },
      { table: "complaints", parents: { userId: "users" }, key: ["userId", "subject", "category", "description", "createdAt"] },
      { table: "comments", parents: { userId: "users", postId: "posts" }, key: ["userId", "postId", "content", "createdAt"] },
      { table: "votes", parents: { userId: "users", postId: "posts" }, key: ["userId", "postId", "voteType", "createdAt"] },
      { table: "reports", parents: { userId: "users", postId: "posts" }, key: ["userId", "postId", "reason", "description", "createdAt"] },
      { table: "notifications", parents: { userId: "users" }, key: ["userId", "type", "message", "createdAt"] },
      { table: "complaint_responses", parents: { adminId: "users", complaintId: "complaints" }, key: ["adminId", "complaintId", "response", "createdAt"] },
    ];

    for (const definition of taskDefinitions) {
      const { table, parents, key } = definition;
      const destinationRows = await rows(target, table);
      const known = new Map(destinationRows.map((row) => [fingerprint(row, key), row.id]));
      for (const sourceRow of await rows(source, table)) {
        const data = { ...sourceRow };
        for (const [foreignKey, parentTable] of Object.entries(parents)) {
          const mappedId = maps[parentTable].get(data[foreignKey]);
          if (!mappedId) throw new Error(`Cannot map ${table}.${foreignKey} for source row ${sourceRow.id}.`);
          data[foreignKey] = mappedId;
        }
        const keyValue = fingerprint(data, key);
        const existingId = known.get(keyValue);
        if (existingId) {
          maps[table].set(sourceRow.id, existingId);
          counts[table].alreadyPresent++;
          continue;
        }
        const targetId = await insertRow(table, data, schemas[table].targetColumns);
        maps[table].set(sourceRow.id, targetId);
        known.set(keyValue, targetId);
        counts[table].copied++;
      }
    }

    await target.query("COMMIT");
    console.log(JSON.stringify({ success: true, counts }));
  } catch (error) {
    await target.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    await Promise.allSettled([source.end(), target.end()]);
  }
}

run().catch((error) => {
  console.error(`Data import rolled back: ${error.message}`);
  process.exitCode = 1;
});
