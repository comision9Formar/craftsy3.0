'use strict';

const products = require('../../data/productosDB')

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('Products', products, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Products', null, {});
     
  }
};
