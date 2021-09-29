'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('Users', [
        {
          name : 'admin',
          email : 'admin@craftsy.com',
          password : bcrypt.hashSync('123123',10),
          avatar : 'avatar_default.png',
          rolId : 1,
          createdAt : new Date,
          updatedAt : new Date
        }
      ], {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Users', null, {});
     
  }
};
