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
    name: DataTypes.STRING,
    description: DataTypes.STRING(500),
    price: DataTypes.DECIMAL(8,2),
    discount: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};