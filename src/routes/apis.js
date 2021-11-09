const router = require('express').Router()
const {getCategories, createProduct, getProducts,detailProduct, updateProduct,destroyProduct,getMails, getAllProduct, verifyPassword,search,deleteImage,addImage} = require('../controllers/apisController');
const {show,add,remove, empty} = require('../controllers/cartController');

const upload = require('../middlewares/imageProductStorage');

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
    .get('/cart/remove/:id',remove)
    .get('/cart/empty',empty)
    .get('/products/delete-image/:id',deleteImage)
    .post('/products/add-images/:id',upload.any(),addImage)



module.exports = router

