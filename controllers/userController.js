const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, CLIENT_URL } = require("../utils/config");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");

const userController = {
  editProfile: async (request, response) => {
    try {
      const { name } = request.body;
      const { id } = request.params;
      await User.findByIdAndUpdate(id, { name });
      response.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  forgotPassword: async (request, response) => {
    try {
      const { email } = request.body;
      const existingUser = await User.findOne({ email: { $eq: email } });
      if (!existingUser)
        return response.status(404).json({ message: "User not exits" });
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
      const resetLink = `${CLIENT_URL}/reset-password/${token}`;
      existingUser.resetToken = token;
      await existingUser.save();
      await sendEmail(
        email,
        "Password Reset Link",
        `<p>
          Click <a href=${resetLink}>here</a> to reset your password. The link is
          valid for 1 hour.
        </p>`
      );
      response
        .status(200)
        .json({ message: `Password reset link sent to ${email}` });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { password } = request.body;
      const { token } = request.params;
      const hashedPassword = await bcrypt.hash(password, 10);
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findOne({
        email: { $eq: decoded.email },
        resetToken: { $eq: token },
      });
      if (!user)
        return response
          .status(404)
          .json({ messaage: "Invalid or expired token" });
      user.password = hashedPassword;
      user.resetToken = null;
      await user.save();
      response.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
