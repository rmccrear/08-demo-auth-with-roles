"use strict";

require("dotenv").config();

const { db } = require("./db");

// initalize user models
require("./src/auth/models");
require("./src/models/index");

const server = require("./src/server.js");

db.sync().then(() => {
  server.start(3000);
});
