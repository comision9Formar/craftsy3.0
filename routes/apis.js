const router = require('express').Router()
const {getCategories, createProduct} = require('../controllers/apisController');

/* /api */
router 
    .get('/categories',getCategories)
    .post('/products',createProduct)



module.exports = router

