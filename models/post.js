'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'author'
      });
      this.belongsToMany(models.Category, {
        through: 'PostCategories', as: 'PostCategory',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Comment, {
        foreignKey: 'post',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Like, {
        onDelete: 'CASCADE'
      });
    }
  }
  Post.init({

    author: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    publishAt: {
      type: DataTypes.DATE
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};