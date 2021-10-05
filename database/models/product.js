'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category,{
        as : 'category'
      })
      Product.hasMany(models.Image, {
        as : 'images'
      })
    }
  };
  Product.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : "El campo 'name' no pude ser nulo"
        },
        notEmpty : {
          msg : "El nombre del producto es requerido"
        }
      }
    },
    description:{
      type : DataTypes.STRING(500),
      allowNull : false,
      validate : {
        notNull : {
          msg : "El campo 'description' no pude ser nulo"
        },
        notEmpty : {
          msg : "La descripción del producto es requerida"
        }
      }
    },
    price: {
      type : DataTypes.DECIMAL(8,2),
      allowNull : false,
      validate : {
        notNull : {
          msg : "El campo 'price' no pude ser nulo"
        },
        notEmpty : {
          msg : "El precio del producto es requerido"
        }
      }
    },
    discount: DataTypes.INTEGER,
    categoryId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : "El campo 'categoryId' no pude ser nulo"
        },
        notEmpty : {
          msg : "La categoría del producto es requerida"
        }
      }
    } 
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};