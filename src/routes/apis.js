const router = require('express').Router()
const {getCategories, createProduct, getProducts,detailProduct, updateProduct,destroyProduct,getMails, getAllProduct, verifyPassword,search} = require('../controllers/apisController');
const {show,add} = require('../controllers/cartController')
/* /api */
router 
    .get('/categories',getCategories)
    .post('/products',createProduct)
    .get('/products',getProducts)
    .get('/products-all',getAllProduct)
    .get('/products/:id',detailProduct)
    .put('/products/:id',updateProduct)
    .delete('/products/:id',destroyProduct)
    .get('/emails',getMails)
    .post('/verify-password',verifyPassword)
    .get('/search',search)
    .get('/cart/show',show)
    .get('/cart/add/:id',add)



module.exports = router

