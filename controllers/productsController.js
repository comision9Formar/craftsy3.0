const fs = require('fs');
const path = require('path');
const productos = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','productos.json'),'utf-8'));
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','categorias.json'),'utf-8'));

const {validationResult} = require('express-validator');

const capitalizeOneLetter = require('../utils/capitalizeOneLetter');

module.exports = {
    add : (req,res) => {
        return res.render('productAdd',{
            categorias,
            productos,
        })
    },
    store : (req,res) => {

        let errors = validationResult(req);

        if(errors.isEmpty()){
            const {nombre,precio,descripcion,categoria} = req.body;
       
            let producto = {
                id: productos[productos.length - 1].id + 1,
                nombre,
                precio : +precio,
                descripcion,
                categoria,
                imagen : req.file ? req.file.filename : 'default-image.png'
            }
     
            productos.push(producto)
            fs.writeFileSync(path.join(__dirname,'..','data','productos.json'),JSON.stringify(productos,null,2),'utf-8');
            return res.redirect('/admin')
        }else{
            return res.render('productAdd',{
                categorias,
                productos,
                errores : errors.mapped(),
                old : req.body
            })
        }

      
    
    },
    detail : (req,res) => {
        let producto = productos.find(producto => producto.id === +req.params.id)
            return res.render('productDetail',{
                producto,
                capitalizeOneLetter
            })

    },
    edit : (req,res) => {
        let producto = productos.find(producto => producto.id === +req.params.id)
        return res.render('productEdit',{
            productos,
            categorias,
            producto,
        })
    },
    update : (req,res) => {
        let errors = validationResult(req);
        let producto = productos.find(producto => producto.id === +req.params.id)

        if(errors.isEmpty()){
            
            const {nombre,precio,descripcion,categoria} = req.body;

            productos.forEach(producto => {
                if(producto.id === +req.params.id){
                    producto.nombre = nombre;
                    producto.descripcion = descripcion;
                    producto.precio = +precio;
                    producto.categoria = categoria
                }
            });
    
            fs.writeFileSync(path.join(__dirname,'..','data','productos.json'),JSON.stringify(productos,null,2),'utf-8');
            return res.redirect('/')
        }else{
            return res.render('productEdit',{
                productos,
                categorias,
                producto,
                errores : errors.mapped(),
            })
        }
      
    },
    destroy : (req,res) => {
        let productosModificados = productos.filter(producto => producto.id !== +req.params.id);

        fs.writeFileSync(path.join(__dirname,'..','data','productos.json'),JSON.stringify(productosModificados,null,2),'utf-8');
        return res.redirect('/admin')

    }
}