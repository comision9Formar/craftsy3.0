'use strict';

const images = [];
const files = ['img-phone-01.jpg','img-phone-02.png','img-phone-03.webp']

for (let i = 1; i <= 10; i++) {
  files.forEach(img => {
    let image = {
        file : img,
        productId : i,
        createdAt : new Date,
        updatedAt : new Date
    }
    images.push(image)
  }); 
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
      await queryInterface.bulkInsert('Images', images, {});
    
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('Images', null, {});
     
  }
};
