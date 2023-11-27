'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
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
      this.belongsTo(models.Post, {
        foreignKey: 'post'
      });
      this.hasMany(models.Like, {
        onDelete: 'CASCADE'
      });
    }
  }
  Comment.init({
    author: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    post: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};