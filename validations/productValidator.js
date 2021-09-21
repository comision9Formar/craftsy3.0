const { check } = require('express-validator');

module.exports = [

    check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio'),

    check('descripcion')
    .notEmpty().withMessage('Se requiere una descripción'),

    check('precio')
    .notEmpty().withMessage('Debes indicar el precio')
    .isInt().withMessage('Debe ser un número'),

    check('categoria')
    .notEmpty()
    .withMessage('Indica la categoría')
]