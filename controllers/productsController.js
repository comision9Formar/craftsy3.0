const {validationResult} = require('express-validator');
const capitalizeOneLetter = require('../utils/capitalizeOneLetter');
const fs = require('fs');
const path = require('path');
const db = require('../database/models')

module.exports = {
    add : (req,res) => {
        db.Category.findAll({
            order : [
                ['name','ASC']
            ]
        })
            .then(categorias => res.render('productAdd',{
                categorias,
            }))
            .catch(error => console.log(error))
    },
    store : (req,res) => {

        let errors = validationResult(req);

        if(errors.isEmpty()){
            const {nombre,precio,descripcion,categoria} = req.body;
       
            db.Product.create(
                {
                    name : nombre.trim(),
                    description : descripcion.trim(),
                    price : precio,
                    categoryId : categoria
                }
            )
                .then(product => {
                    console.log(product);
                    if(req.files.length != 0){
                        let images = req.files.map(image => {
                            let item = {
                                file : image.filename,
                                productId : product.id
                            }
                            return item
                        }) 

                        db.Image.bulkCreate(images,{validate : true})
                            .then( () => console.log('imagenes guardadas satisfactoriamente'))
                    }

                    return res.redirect('/admin')
                })
                .catch(error => console.log(error))
           
            
        }else{
            db.Category.findAll({
                order : [
                    ['name','ASC']
                ]
            })
                .then(categorias => res.render('productAdd',{
                    categorias,
                    errores : errors.mapped(),
                    old : req.body
                }))
                .catch(error => console.log(error))
          
        }
    },
    detail : (req,res) => {
        db.Product.findByPk(req.params.id, {
            include : ['category','images']
        })
            .then(product => {
                return res.render('productDetail',{
                    product,
                    capitalizeOneLetter
                })
            })
            .catch(error => console.log(error))
    },
    edit : (req,res) => {
        let categories = db.Category.findAll({
            order : [
                ['name']
            ]
        })
        let product = db.Product.findByPk(req.params.id, {
            include : ['category','images']
        })
        Promise.all(([categories, product]))
            .then(([categories, product]) => {
                return res.render('productEdit',{
                    categories,
                    product,
                })
            })
            .catch(error => console.log(error))

       
    },
    update : (req,res) => {
        let errors = validationResult(req);

        if(errors.isEmpty()){
            
            const {nombre,precio,descripcion,categoria} = req.body;
            db.Product.update(
                {
                    name : nombre.trim(),
                    description : descripcion.trim(),
                    price : precio,
                    categoryId : categoria
                },
                {
                    where : {
                        id : req.params.id
                    }
                }
            )
                .then( response => {
                    console.log(response)
                    return res.redirect('/admin')
                })
                .catch(error => console.log(error))

           
        }else{
            let categories = db.Category.findAll({
                order : [
                    ['name']
                ]
            })
            let product = db.Product.findByPk(req.params.id, {
                include : ['category','images']
            })
            Promise.all(([categories, product]))
                .then(([categories, product]) => {
                    return res.render('productEdit',{
                        categories,
                        product,
                        errores : errors.mapped()
                    })
                })
                .catch(error => console.log(error))
        }
      
    },
    destroy : (req,res) => {
        db.Product.findByPk(req.params.id,{
            include : ['images']
        })
            .then(products => {
                products.images.forEach(image => {
                    if(fs.existsSync(path.join(__dirname,'../public/images',image.file))){
                        fs.unlinkSync(path.join(__dirname,'../public/images',image.file))
                    }
                });
                db.Product.destroy({
                    where : {
                        id : req.params.id
                    }
                })
                .then( () => {
                    return res.redirect('/admin')
                })
            })
            .catch(error => console.log(error))

    }
}