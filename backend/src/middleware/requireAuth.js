import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function requireAuth(req, res, next) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfigured (JWT_SECRET missing)" });
    }

    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = header.slice("Bearer ".length);

    const payload = jwt.verify(token, secret);
    const userId = payload?.sub;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: user._id.toString(), username: user.username };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
