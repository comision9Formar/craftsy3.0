const express = require('express');
const router = express.Router();
const {add,store,detail,edit,update,destroy} = require('../controllers/productsController');

const upload = require('../middlewares/imageProductStorage');
const productValidator = require('../validations/productValidator');
const editValidator = require('../validations/productEditValidator');

/* products */
router.get('/add',add);
router.post('/add', upload.array('imagen'), productValidator ,store);

router.get('/detail/:id',detail)

router.get('/edit/:id',edit);
router.put('/edit/:id', upload.array('imagen'), editValidator,update);

router.delete('/delete/:id',destroy);




module.exports =router;