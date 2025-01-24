const User = require("../models/User");

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
};

module.exports = userController;
