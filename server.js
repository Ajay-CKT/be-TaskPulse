const express = require("express");
const { PORT } = require("./utils/config");

const app = express();

app.use(express.json());

app.listen(PORT, () => console.log("Server running..."));
