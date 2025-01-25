const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");
const User = require("../models/User");

const authenticate = {
  checkAuth: async (request, response, next) => {
    // Get token from the cookie
    const token = request.cookies.token;
    // If token not exists
    if (!token) return response.status(401).json({ message: "Unauthorized" });
    // If token exists verify
    jwt.verify(token, SECRET_KEY, (error, user) => {
      if (error) return response.status(401).json({ message: error.message });
      // Set user in request
      request.userId = user.id;
      // Continue to next middleware
      next();
    });
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
