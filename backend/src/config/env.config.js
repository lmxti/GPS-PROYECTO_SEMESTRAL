"use strict";
const path = require("path");

const envFilePath = path.resolve(__dirname, ".env");

require("dotenv").config({ path: envFilePath });

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

module.exports = {
  DB_URL,
  PORT,
};
