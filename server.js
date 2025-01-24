const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config");
const app = require("./app");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.info("Database connected...");
    app.listen(PORT, () => console.info("Server running..."));
  })
  .catch((error) => console.error(error));
