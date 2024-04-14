"use strict";
const path = require("path");

const envFilePath = path.resolve(__dirname, ".env");

require("dotenv").config({ path: envFilePath });

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

module.exports = {
  DB_URL,
  PORT,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET
};
