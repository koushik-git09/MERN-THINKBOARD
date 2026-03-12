import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function requireJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET env var");
  }
  return secret;
}

function signToken(user) {
  const secret = requireJwtSecret();
  return jwt.sign(
    { sub: user._id.toString(), username: user.username },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 3) {
      return res.status(400).json({ message: "username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" });
    }

    const existing = await User.findOne({ username: normalizedUsername });
    if (existing) {
      return res.status(409).json({ message: "username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: normalizedUsername,
      passwordHash,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: { id: user._id.toString(), username: user.username },
    });
  } catch (error) {
    console.error("Error in register controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const normalizedUsername = String(username).trim();

    const user = await User.findOne({ username: normalizedUsername }).select(
      "+passwordHash"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);

    res.status(200).json({
      token,
      user: { id: user._id.toString(), username: user.username },
    });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function me(req, res) {
  res.status(200).json({ user: req.user });
}
