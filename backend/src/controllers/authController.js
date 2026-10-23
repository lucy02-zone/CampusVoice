const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const { User } = require("../models");
const { generateAnonymousHandle } = require("../utils/anonymousHandle");

const getCurrentUser = async (req, res) => {
  const { id, name, email, role, anonymousHandle } = req.user;
  res.json({ success: true, user: { id, name, email, role, anonymousHandle } });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new passwords are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ success: false, message: "New password must be different from your current password" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (role && role !== "STUDENT") {
      return res.status(400).json({
        success: false,
        message: "Mentor and admin accounts must be created by an administrator",
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "STUDENT",
    });

    // Generate and persist the anonymous handle now that we have the user id
    const anonymousHandle = generateAnonymousHandle(user.id);
    await user.update({ anonymousHandle });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        anonymousHandle: user.anonymousHandle,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      where: sequelize.where(sequelize.fn("LOWER", sequelize.col("email")), normalizedEmail),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        anonymousHandle: user.anonymousHandle,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  changePassword,
};
