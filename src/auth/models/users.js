"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define("Users", {
    username: { type: DataTypes.STRING, required: true, unique: true },
    password: { type: DataTypes.STRING, required: true },
    role: {
      type: DataTypes.ENUM("user", "writer", "editor", "admin", "auth_admin"),
      required: true,
      defaultValue: "user",
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        console.log(SECRET, this.username);
        return jwt.sign({ username: this.username }, SECRET);
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ["read"],
          writer: ["read", "create"],
          editor: ["read", "create", "update"],
          admin: ["read", "create", "update", "delete"],
          auth_admin: [
            "read_user",
            "create_user",
            "update_user",
            "delete_user",
          ],
        };
        return acl[this.role];
      },
    },
  });

  model.beforeCreate(async (user) => {
    console.log(user);
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error("Invalid User");
  };

  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userModel;
