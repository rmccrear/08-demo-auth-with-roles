const { users } = require("../../auth/models");
("use strict");

const imageModel = (sequelize, DataTypes) =>
  sequelize.define("Image", {
    title: { type: DataTypes.STRING, required: true },
    assigment: { type: DataTypes.STRING, required: true },
    description: { type: DataTypes.STRING, required: true },
    imgUrl: { type: DataTypes.STRING, required: true },
    ownerId: { type: DataTypes.INTEGER, required: true },
  });

imageModel.BelongsTo(users);

imageModel.beforeCreate(async (image) => {
  console.log(image);
  // TODO:
  return Promise.resolve(image.imgUrl);
});

module.exports = imageModel;
