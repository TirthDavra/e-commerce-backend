import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findById(decoded.id).select("name email role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (error) {
    console.error("Auth middleware error", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
