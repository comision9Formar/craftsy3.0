const express = require('express');
const router = express.Router();
const {register, login, processLogin, processRegister, profile,update, logout} = require('../controllers/usersController');
const loginValidator = require('../validations/loginValidator');

const registerValidator = require('../validations/registerValidator');
const avatarStorage = require('../middlewares/avatarStorage');

/* /users */
router.get('/register',register);
router.post('/register',registerValidator, processRegister);
router.get('/login',login);
router.post('/login',loginValidator, processLogin);
router.get('/profile',profile);
router.put('/update',avatarStorage.single('avatar'),update);
router.get('/logout',logout)


module.exports =router;