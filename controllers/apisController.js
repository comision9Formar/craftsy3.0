const { validationResult } = require('express-validator');
const capitalizeOneLetter = require('../utils/capitalizeOneLetter');
const fs = require('fs');
const path = require('path');
const db = require('../database/models');

const throwError = (res, error) => {
    return res.status(error.status || 500).json({
        status: error.status || 500,
        errors: error.errors
    })
}


module.exports = {
    getCategories: async (req, res) => {
        try {
            let categorias = await db.Category.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })

            let response = {
                status: 200,
                meta: {
                    total: categorias.length,
                    link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                },
                data: categorias
            }
            return res.status(200).json(response)
        } catch (error) {
            throwError(res, error)
        }
    },
    getProducts: async (req, res) => {
        try {
            let products = await db.Product.findAll()
            let response = {
                status: 200,
                meta: {
                    total: products.length,
                    link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                },
                data: products
            }
            return res.status(200).json(response)
        } catch (error) {
            throwError(res, error)
        }
    },
    createProduct: async (req, res) => {

        try {
            let errors = [];
            if (typeof req.body.name == "undefined") {
                let item = {
                    field: 'name',
                    msg: "El campo 'name' no pude ser nulo"
                }
                errors.push(item)
            }
            if (typeof req.body.description == "undefined") {
                let item = {
                    field: 'description',
                    msg: "El campo 'description' no pude ser nulo"
                }
                errors.push(item)
            }
            if (errors.length != 0) {
                return throwError(res, {
                    status: 500,
                    errors
                })
            }
            const { name, price, description, categoryId } = req.body;

            const product = await db.Product.create(
                {
                    name: name.trim(),
                    description: description.trim(),
                    price,
                    categoryId
                }
            )
            let response = {
                status: 201,
                meta: {
                    link: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
                    msg: 'El producto se ha guardado con éxito'
                },
                data: product
            }
            return res.status(201).json(response)
        } catch (error) {
            let response = {
                status: error.status || 500,
                errors: error.errors.map(error => {
                    let item = {
                        field: error.path,
                        msg: error.message
                    }
                    return item
                })
            }

            return res.status(error.status || 500).json(response)
        }
    },
    detailProduct: async (req, res) => {
        try {
            if(Number.isNaN(+req.params.id)){
                return throwError(res, {
                    status: 400,
                    errors : 'ID incorrecto'
                })
            } 

            let product = await db.Product.findByPk(req.params.id, {
                include: ['category', 'images']
            })
            if(product){
                let response = {
                    status: 200,
                    meta: {
                        link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    data: product
                }
                return res.status(200).json(response)
            }else{
                return throwError(res, {
                    status: 400,
                    errors : 'Producto inexistente'
                })
            }
           
        } catch (error) {
            throwError(res, error)
        }
    },
    edit: (req, res) => {
        let categories = db.Category.findAll({
            order: [
                ['name']
            ]
        })
        let product = db.Product.findByPk(req.params.id, {
            include: ['category', 'images']
        })
        Promise.all(([categories, product]))
            .then(([categories, product]) => {
                return res.render('productEdit', {
                    categories,
                    product,
                })
            })
            .catch(error => console.log(error))


    },
    update: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {

            const { nombre, precio, descripcion, categoria } = req.body;
            db.Product.update(
                {
                    name: nombre.trim(),
                    description: descripcion.trim(),
                    price: precio,
                    categoryId: categoria
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
                .then(response => {
                    console.log(response)
                    return res.redirect('/admin')
                })
                .catch(error => console.log(error))


        } else {
            let categories = db.Category.findAll({
                order: [
                    ['name']
                ]
            })
            let product = db.Product.findByPk(req.params.id, {
                include: ['category', 'images']
            })
            Promise.all(([categories, product]))
                .then(([categories, product]) => {
                    return res.render('productEdit', {
                        categories,
                        product,
                        errores: errors.mapped()
                    })
                })
                .catch(error => console.log(error))
        }

    },
    destroy: (req, res) => {
        db.Product.findByPk(req.params.id, {
            include: ['images']
        })
            .then(products => {
                products.images.forEach(image => {
                    if (fs.existsSync(path.join(__dirname, '../public/images', image.file))) {
                        fs.unlinkSync(path.join(__dirname, '../public/images', image.file))
                    }
                });
                db.Product.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(() => {
                        return res.redirect('/admin')
                    })
            })
            .catch(error => console.log(error))

    }
}