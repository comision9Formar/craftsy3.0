const express = require('express');
const router = express.Router();
const {index, search, admin, addBanner,allBanner,storeBanner} = require('../controllers/mainController');

const upload = require('../middlewares/imageBannerStorage');
const adminUserCheck = require('../middlewares/adminUserCheck');

router.get('/',index);
router.get('/search',search);
router.get('/admin', adminUserCheck, admin);
router.get('/admin/banner/add',adminUserCheck ,addBanner);
router.post('/admin/banner/add',upload.single('image'), storeBanner)
router.get('/admin/banner/all',adminUserCheck,allBanner);

module.exports =router;