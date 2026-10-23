const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const sequelize = require("../src/config/database");
const { User } = require("../src/models");
const { generateAnonymousHandle } = require("../src/utils/anonymousHandle");

dotenv.config();

const email = process.env.ADMIN_EMAIL || "admin@campusvoice.local";
const name = process.env.ADMIN_NAME || "CampusVoice Administrator";

async function createAdmin() {
  try {
    await sequelize.authenticate();
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error(`An account already exists for ${email}. No account was changed.`);
    }

    const password = crypto.randomBytes(18).toString("base64url");
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
    });
    await user.update({ anonymousHandle: generateAnonymousHandle(user.id) });

    console.log("Administrator account created.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("Sign in at /admin/login and change this password after your first login.");
  } catch (error) {
    console.error(`Could not create administrator: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

createAdmin();
