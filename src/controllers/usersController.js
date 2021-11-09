const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');
let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'usuarios.json'), 'utf-8'));

module.exports = {
    register: (req, res) => {
        return res.render('register', {
            title: 'Registro',
        })
    },
    processRegister: (req, res) => {

        let errors = validationResult(req)

        if (errors.isEmpty()) {
            const { name, email, password } = req.body;
            db.User.create({
                name: name.trim(),
                email,
                password: bcryptjs.hashSync(password, 10),
                avatar: 'default.png',
                rolId: 2,
            })
                .then(user => {
                    req.session.userLogin = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        rolId: user.rolId
                    }
                    return res.redirect('/')
                })
                .catch(error => console.log(error))
        } else {
            return res.render('register', {
                title: 'Registro',
                errores: errors.mapped(),
                old: req.body
            })
        }
    },
    login: (req, res) => {
        return res.render('login', {
            title: 'Login',
        })
    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            const { email, recordar } = req.body;
            db.User.findOne({
                where: {
                    email
                }
            })
                .then(user => {
                    req.session.userLogin = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        rolId: user.rolId
                    }
                    if (recordar) {
                        res.cookie('craftsyForEver', req.session.userLogin, { maxAge: 1000 * 60 })
                    }

                    /* carrito */

                    req.session.cart = [];
                    db.Order.findOne({
                        where :{
                            userId : req.session.userLogin.id,
                            status : 'pending'
                        },
                        include : [
                            {
                                association : 'carts',
                                include :[
                                    {
                                        association : 'product',
                                        include : ['category','images']
                                    }
                                ]
                            }
                        ]
                    }).then( order => {
                        if(order){
                            order.carts.forEach(item => {
                                let product = {
                                    id : item.productId,
                                    nombre : item.product.name,
                                    imagen : item.product.images[0].file,
                                    precio : item.product.price,
                                    categoria : item.product.category.name,
                                    cantidad : +item.quantity,
                                    subtotal : item.product.price * item.quantity,
                                    orderId : order.id

                                }
                                req.session.cart.push(product)
                            })
                            //console.log(req.session.cart)
                        }
                        return res.redirect('/')

                    })


                })
                .catch(error => console.log(error))
        } else {
            return res.render('login', {
                title: 'Login',
                errores: errors.mapped()
            })
        }
    },
    profile: (req, res) => {
        db.User.findByPk(req.session.userLogin.id)
            .then(user => {
                return res.render('profile', {
                    title: "Perfil de usuario",
                    user
                })
            })
            .catch(error => console.log(error))

    },
    update : (req,res) => {
        console.log(req.body)
        db.User.update(
            {
                name: req.body.name,
                avatar: req.file ? req.file.filename : req.session.userLogin.avatar,
            },
            {
                where : {id : req.session.userLogin.id},
            },
        )
        .then( () => {
            return res.redirect('/')
        })
        .catch(error => console.log(error))

    },
    logout: (req, res) => {
        req.session.destroy();
        res.cookie('craftsyForEver', null, { maxAge: -1 })
        return res.redirect('/')
    }
}