'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
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
      this.belongsTo(models.User, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entity: 'user'
        }
      });
      this.belongsTo(models.Post, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entity: 'post'
        }
      });
      this.belongsTo(models.Comment, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
          entity: 'comment'
        }
      });
    }
  }
  Like.init({

    author: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },

    entity: {
      type: DataTypes.ENUM('user', 'post', 'comment'),
      primaryKey: true,
      allowNull: false
    },

    entityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },

    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      defaultValue: 'like',
      allowNull: false
    }
  }, {
    // hooks: {
    //   beforeCreate: async function(like, options) {
    //     // Визначте, до якої моделі належить лайк
    //     const entityModel = options.sequelize.models[like.entity.charAt(0).toUpperCase() + like.entity.slice(1)];

    //     if (!entityModel) {
    //       throw new Error('Неправильний тип entity');
    //     }

    //     // Перевірте, чи існує запис з вказаним ID в таблиці цієї моделі
    //     const entityInstance = await entityModel.findByPk(like.entityId);

    //     if (!entityInstance) {
    //       throw new Error(`Запис з ID ${like.entityId} не знайдено в таблиці ${like.entity}`);
    //     }

    //     // Встановіть значення entity згідно з моделлю, до якої належить лайк
    //     like.entity = entityModel.name.toLowerCase();
    //   }
    // },
    sequelize,
    modelName: 'Like',
  });
  return Like;
};