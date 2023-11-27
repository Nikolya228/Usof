'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Token, {
        foreignKey: 'user'
      });
      this.hasMany(models.Post, {
        foreignKey: 'author'
      });
      this.hasMany(models.Comment, {
        foreignKey: 'author'
      });
      this.hasMany(models.Like, {
        foreignKey: 'entityId'
      });
    }
  }
  User.init({
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'default.jpg'
    },

    role: {
      type: DataTypes.ENUM('admin', 'member'),
      defaultValue: 'member',
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, Number(process.env.BCRYPT_SALT));
      },
      beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password,  Number(process.env.BCRYPT_SALT));
        }
      }
    },
    sequelize,
    paranoid: true,
    modelName: 'User',
  });
  return User;
};
