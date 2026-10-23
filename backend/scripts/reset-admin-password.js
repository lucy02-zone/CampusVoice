const readline = require("readline");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const sequelize = require("../src/config/database");
const { User } = require("../src/models");

dotenv.config();

const ask = (rl, prompt) => new Promise((resolve) => rl.question(prompt, resolve));

const askHidden = (prompt) => new Promise((resolve, reject) => {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    reject(new Error("Run this command in an interactive terminal."));
    return;
  }

  process.stdout.write(prompt);
  let value = "";
  const onData = (chunk) => {
    const char = chunk.toString("utf8");
    if (char === "\u0003") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      reject(new Error("Password reset cancelled."));
    } else if (char === "\r" || char === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("data", onData);
      process.stdout.write("\n");
      resolve(value);
    } else if (char === "\u007f" || char === "\b") {
      value = value.slice(0, -1);
    } else if (char >= " ") {
      value += char;
    }
  };

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", onData);
});

async function resetAdminPassword() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    await sequelize.authenticate();
    const defaultEmail = process.env.ADMIN_EMAIL || "admin@campusvoice.local";
    const enteredEmail = await ask(rl, `Admin email [${defaultEmail}]: `);
    const email = (enteredEmail.trim() || defaultEmail).toLowerCase();
    rl.close();

    const password = await askHidden("New password (at least 8 characters): ");
    const confirmation = await askHidden("Confirm new password: ");
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (password !== confirmation) throw new Error("Passwords do not match.");

    const admin = await User.findOne({ where: sequelize.where(sequelize.fn("LOWER", sequelize.col("email")), email) });
    if (!admin || admin.role !== "ADMIN") throw new Error(`No administrator account found for ${email}.`);

    admin.password = await bcrypt.hash(password, 12);
    await admin.save();
    console.log(`Password updated for ${admin.email}. You can now sign in at /admin/login.`);
  } finally {
    if (!rl.closed) rl.close();
    await sequelize.close();
  }
}

resetAdminPassword().catch((error) => {
  console.error(`Could not reset administrator password: ${error.message}`);
  process.exitCode = 1;
});
