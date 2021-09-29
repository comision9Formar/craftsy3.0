'use strict';

const categories = [
  {
    name : 'nuevo',
    createdAt : new Date,
    updatedAt : new Date
  },
  {
    name : 'usado',
    createdAt : new Date,
    updatedAt : new Date
  },
  {
    name : 'refaccionado',
    createdAt : new Date,
    updatedAt : new Date
  }
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('Categories', categories, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Categories', null, {});
     
  }
};
