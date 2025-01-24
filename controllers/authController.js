const authController = {
  register: async (request, response) => {
    try {
      const { name, email, password } = request.body;
      response.status(201).json({ message: "Registration successful!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;
      response.status(200).json({ message: "Login successful!" });
    } catch (error) {
      response.status(401).json({ message: error.message });
    }
  },
  logout: async (request, response) => {
    try {
      response.status(200).json({ message: "Logout successful!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
  checkMe: async (request, response) => {
    try {
      response.status(200).json({ message: "User fetched!" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
