const { check, body } = require('express-validator');

module.exports = [

    check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),

    check('descripcion')
    .notEmpty().withMessage('Se requiere una descripción'),

    check('precio')
    .notEmpty().withMessage('Debes indicar el precio')
    .isDecimal().withMessage('Debe ser un número'),

    check('categoria')
    .notEmpty()
    .withMessage('Indica la categoría'),

    body('imagen')
    .custom((value, {req}) => {
        if(req.files[0]){
            return true
        }else{
            return false
        }
    }).withMessage('No ha subido ninguna imagen')
]