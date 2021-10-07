const router = require('express').Router()
const {getCategories, createProduct, getProducts,detailProduct, updateProduct,destroyProduct} = require('../controllers/apisController');

/* /api */
router 
    .get('/categories',getCategories)
    .post('/products',createProduct)
    .get('/products',getProducts)
    .get('/products/:id',detailProduct)
    .put('/products/:id',updateProduct)
    .delete('/products/:id',destroyProduct)



module.exports = router

