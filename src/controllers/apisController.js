const { validationResult } = require('express-validator');
const capitalizeOneLetter = require('../utils/capitalizeOneLetter');
const fs = require('fs');
const path = require('path');
const db = require('../database/models');
const { Op } = require('sequelize');

const bcryptjs = require('bcryptjs');
const { AsyncResource } = require('async_hooks');

const throwError = (res, error) => {
    return res.status(error.status || 500).json({
        status: error.status || 500,
        errors: error.errors
    })
}

const getUrl = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`


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
        console.log(req.query)
        let products;
        try {
            if (+req.query.filter !== 0 && req.query.search) {
                products = await db.Product.findAll({
                    where: {
                        categoryId: req.query.filter,
                        name: {
                            [Op.substring]: req.query.search
                        }
                    },
                    order: [
                        [req.query.order || 'id']
                    ],
                    limit: +req.query.limit,
                    include: ['images', 'category'],

                })
            } else if (+req.query.filter !== 0) {
                products = await db.Product.findAll({
                    where: {
                        categoryId: req.query.filter,
                    },
                    order: [
                        [req.query.order || 'id']
                    ],
                    limit: +req.query.limit,
                    include: ['images', 'category'],

                })
            } else {
                products = await db.Product.findAll({
                    limit: +req.query.limit,
                    order: [
                        [req.query.order || 'id']
                    ],
                    include: ['images', 'category'],
                })
            }

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
            console.log(error)
            throwError(res, error)
        }
    },
    getAllProduct: async (req, res) => {
        try {
            let products = await db.Product.findAll({
                include: ['images', 'category'],
            })

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
            if (Number.isNaN(+req.params.id)) {
                return throwError(res, {
                    status: 400,
                    errors: 'ID incorrecto'
                })
            }

            let product = await db.Product.findByPk(req.params.id, {
                include: ['category', 'images']
            })
            if (product) {
                let response = {
                    status: 200,
                    meta: {
                        link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    data: product
                }
                return res.status(200).json(response)
            } else {
                return throwError(res, {
                    status: 400,
                    errors: 'Producto inexistente'
                })
            }

        } catch (error) {
            console.log(error)
            throwError(res, error)
        }
    },
    updateProduct: async (req, res) => {

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
            let update = await db.Product.update(
                {
                    name: name.trim(),
                    description: description.trim(),
                    price: price,
                    categoryId: categoryId
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            if (update[0] === 1) {
                let response = {
                    status: 200,
                    meta: {
                        link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    msg: 'Producto actualizado!'
                }
                return res.status(200).json(response)
            } else {
                throw new Error
            }

        } catch (error) {
            console.log(error)
            throwError(res, error)
        }
    },
    destroyProduct: async (req, res) => {

        try {
            let product = await db.Product.findByPk(req.params.id, {
                include: ['images']
            })
            if (product) {
                product.images.forEach(image => {
                    if (fs.existsSync(path.join(__dirname, '../public/images', image.file))) {
                        fs.unlinkSync(path.join(__dirname, '../public/images', image.file))
                    }
                });
            }

            let remove = await db.Product.destroy({
                where: {
                    id: req.params.id
                }
            })
            return res.json(remove)
            if (remove[0] === 1) {
                let response = {
                    status: 200,
                    meta: {
                        link: `${req.protocol}://${req.get('host')}${req.originalUrl}`
                    },
                    msg: 'Producto actualizado!'
                }
                return res.status(200).json(response)
            } else {
                throw new Error
            }

        } catch (error) {
            console.log(error)
        }

        db.Product.findByPk(req.params.id, {
            include: ['images']
        })
    },
    getMails: async (req, res) => {
        try {
            let result = await db.User.findAll({
                attributes: ['email']
            })
            let emails = result.map(user => user.email)
            return res.status(200).json({
                meta: {
                    link: getUrl(req),
                    total: emails.length
                },
                data: emails
            })
        } catch (error) {
            console.log(error)
            throwError(res, error)

        }
    },
    verifyPassword: async (req, res) => {
        console.log(req.body)
        try {
            let user = await db.User.findOne({
                where: { email: req.body.email }
            })
            if (bcryptjs.compareSync(req.body.password, user.password)) {
                return res.status(200).json({ response: true })
            } else {
                return res.status(200).json({ response: false })
            }
        } catch (error) {
            console.log()
            return res.status(500).json({ response: error })

        }

    },
    search: async (req, res) => {
        console.log(req.query)
        let products;

        try {
            if (+req.query.filter !== 0) {
                products = await db.Product.findAll({
                    where: {
                        categoryId: req.query.filter,
                        name: {
                            [Op.substring]: req.query.search
                        }
                    },
                    order: [
                        [req.query.order || 'id']
                    ],
                    limit: +req.query.limit,
                    include: ['images', 'category'],

                })
            } else {
                products = await db.Product.findAll({
                    include: ['category', 'images'],
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.substring]: req.query.search
                                }
                            },
                            {
                                description: {
                                    [Op.substring]: req.query.search
                                }
                            }
                        ]
                    },
                    limit: req.query.limit,
                    order: [
                        [req.query.order || 'id']
                    ],
                })
            }

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
            console.log()
            return res.status(500).json({ response: error })
        }

    },
    deleteImage: async (req, res) => {
        try {
            let image = await db.Image.findByPk(req.params.id);

            fs.existsSync(path.join(__dirname, '../../public/images' + image.file)) && fs.unlinkSync(path.join(__dirname, '../../public/images' + image.file));

            await db.Image.destroy({ where: { id: req.params.id } });

            let images = await db.Image.findAll({
                where: {
                    productId: image.productId
                }
            })
            let response = {
                status: 200,
                meta: {
                    msg: 'imagen eliminada',
                },
                data: images
            }
            return res.status(201).json(response)

        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                status: error.status || 500,
                msg: error.message
            })
        }
    },
    addImage: async (req, res) => {
        try {
            let files = req.files.map(image => {
                let img = {
                    file: image.filename,
                    productId: req.params.id
                }
                return img
            })

            await db.Image.bulkCreate(files, { validate: true });

            let images = await db.Image.findAll({
                where: {
                    productId: req.params.id
                }
            })
            let response = {
                status: 201,
                meta: {
                    msg: 'imagenes agregadas',
                },
                data: images
            }
            return res.status(201).json(response)

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                status: error.status || 500,
                msg: error.message
            })
        }
    }
}