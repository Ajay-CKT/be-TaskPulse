const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");

const authController = {
  register: async (request, response) => {
    try {
      // Get registration details from request body
      const { name, email, password, role } = request.body;
      // Find if user already exists with this email
      const existingUser = await User.findOne({ email: { $eq: email } });
      // If already user exist, return response
      if (existingUser)
        return response.status(409).json({ message: "User already exists" });
      // If not, hash the password and save the new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      // Return the success response
      response.status(201).json({ message: "Registration successful!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  login: async (request, response) => {
    try {
      // Get the login details from the request body
      const { email, password } = request.body;
      // Find if there is a user with this email
      const existingUser = await User.findOne({ email: { $eq: email } });
      // If user not exist return response
      if (!existingUser)
        return response.status(404).json({ message: "User not exists" });
      // If user exists, compare the password
      const checkPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      // If password doesn't match return response
      if (!checkPassword)
        return response.status(404).json({ message: "Invalid credentials" });
      // If password matched, generate a token, save in response cookie return success response
      const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
        expiresIn: "3h",
      });
      // return succuss response
      response.status(200).json({ message: "Login successful!", token });
    } catch (error) {
      response.status(401).json({ message: error.message });
    }
  },
  logout: async (request, response) => {
    try {
      // Clear the token from the frontend
      // Return the succuss response
      response.status(200).json({ message: "Logout successful!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  checkMe: async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId).select("-_id name email role");

      if (!user) return response.status(404).json({ message: "Unauthorized" });

      response.status(200).json({ message: "Authorized User!", user });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
