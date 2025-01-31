require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_URL1 = process.env.CLIENT_URL1;
const CLIENT_URL2 = process.env.CLIENT_URL2;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASS = process.env.EMAIL_PASS;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET_KEY,
  CLIENT_URL1,
  CLIENT_URL2,
  EMAIL_ID,
  EMAIL_PASS,
};
