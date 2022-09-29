"use strict";
const { sequelize, DataTypes } = require("../../db");

const clothesModel = require("./clothes/model.js");
const foodModel = require("./food/model.js");
const Collection = require("./data-collection.js");

const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  food: new Collection(food),
  clothes: new Collection(clothes),
};
