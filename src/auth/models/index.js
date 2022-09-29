"use strict";

const userModel = require("./users.js");
const { sequelize, DataTypes } = require("../../../db");
/*types } = require("sequelize");

const DATABASE_URL = process.env.DATABASE_URL || "sqlite:memory:";

const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
};
*/
module.exports = { users: userModel(sequelize, DataTypes) };
