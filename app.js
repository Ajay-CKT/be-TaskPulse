const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const { CLIENT_URL1 } = require("./utils/config");
const app = express();
const fileupload = require("express-fileupload");

app.use(fileupload({ useTempFiles: true }));

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL1,
  })
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

module.exports = app;
