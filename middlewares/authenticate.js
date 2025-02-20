const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");
const User = require("../models/User");

const authenticate = {
  checkAuth: async (request, response, next) => {
    const authHeader = request.headers.authorization;
    // If token not exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      request.userId = decoded.id;
      next();
    } catch (error) {
      response.status(403).json({ message: "Invalid token" });
    }
  },
  allowedRoles: (roles) => {
    return async (request, response, next) => {
      const userId = request.userId;
      const user = await User.findById(userId);
      if (!user) return response.status(401).json({ message: "Unauthorized" });
      if (!roles.includes(user.role))
        return response.status(403).json({ message: "Forbidden" });
      next();
    };
  },
};

module.exports = authenticate;
