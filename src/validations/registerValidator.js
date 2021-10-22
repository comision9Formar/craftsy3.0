const {body,check} = require('express-validator');
const db = require('../database/models')


module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min : 2,
            max : 50
        }).withMessage('Como mínimo 2  y máximo 50 caracteres').bail()
        .isAlpha().withMessage('El nombre solo debe contener letras'),
    check('email')
        .isEmail().withMessage('Debe ingresar un email válido'),
    body('email')
    .custom( value => {
       
        return db.User.findOne({
            where : {
                email : value
            }
        })
            .then(user => {
                if(user){
                    return Promise.reject('El email ya se encuentra registrado')
                }
            })
    }),
    check('password')
        .isLength({
            min : 6,
            max : 12
        }).withMessage('La contraseña debe tener 6 y 12 caracteres'),
    body('password2')
        .custom((value, {req}) => {
            if(value != req.body.password) {
                return false
            }
            return true
        }).withMessage('Las contraseñas no coinciden'),
    check('terminos')
        .isString('on').withMessage('Debes aceptar los términos y condiciones')
]