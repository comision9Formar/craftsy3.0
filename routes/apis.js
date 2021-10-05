const router = require('express').Router()
const {getCategories, createProduct, getProducts,detailProduct} = require('../controllers/apisController');

/* /api */
router 
    .get('/categories',getCategories)
    .post('/products',createProduct)
    .get('/products',getProducts)
    .get('/products/:id',detailProduct)



module.exports = router

