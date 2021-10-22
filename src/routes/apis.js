const router = require('express').Router()
const {getCategories, createProduct, getProducts,detailProduct, updateProduct,destroyProduct,getMails} = require('../controllers/apisController');

/* /api */
router 
    .get('/categories',getCategories)
    .post('/products',createProduct)
    .get('/products',getProducts)
    .get('/products/:id',detailProduct)
    .put('/products/:id',updateProduct)
    .delete('/products/:id',destroyProduct)

    .get('/emails',getMails)



module.exports = router

