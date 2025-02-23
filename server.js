const mongoose = require("mongoose");
const { MONGODB_URI, PORT, CLIENT_URL1 } = require("./utils/config");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.info("✅Database connected...");
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: CLIENT_URL1,
      },
    });
    app.listen(PORT, () => console.info("🚀Server running..."));
    require("./utils/taskScheduler")(io);
    console.info("⏳Task Scheduler started...");
  })
  .catch((error) => console.error(error));
