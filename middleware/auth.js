const jwt = require("jsonwebtoken");
const Employeedb = require("../models/Employeedb");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
    };

    const userExists = await Employeedb.findById(decoded.user.id);
    if (!userExists) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
