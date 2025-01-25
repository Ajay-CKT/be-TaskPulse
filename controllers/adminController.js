const User = require("../models/User");

const adminController = {
  getAllProfiles: async (request, response) => {
    try {
      const users = await User.find({});
      response.status(200).json({ users });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
