require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET_KEY,
  CLIENT_URL,
  EMAIL_ID,
  EMAIL_PASS,
};
