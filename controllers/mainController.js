const fs = require('fs');
const path = require('path');
let productos = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','productos.json'),'utf-8'));
let banner = require('../data/banner.json');

module.exports = {
    index : (req,res) => {
        productos = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','productos.json'),'utf-8'));
        return res.render('index',{
            title : "Craftsy",
            productos,
            banner
        })
    },
    search : (req,res) => {
        if(req.query.busqueda){
            let resultado = productos.filter(producto => producto.nombre.toLowerCase().includes(req.query.busqueda.toLowerCase()))
            return res.render('index',{
                title : "Resultado de la búsqueda",
                productos : resultado,
                busqueda : req.query.busqueda
            })
        }
        return res.redirect('/')
    },
    admin : (req,res) => {
        return res.render('admin/admin',{
            productos
        })
    },
    addBanner : (req,res) => {
        return res.render('admin/bannerAdd')
    },
    allBanner : (req,res) => {
        return res.render('admin/bannerAll',{
            banner
        })
    },
    storeBanner : (req,res) => {
       if(req.file){
           banner.push(req.file.filename);
           fs.writeFileSync(path.join(__dirname,'..','data','banner.json'),JSON.stringify(banner,null,2),'utf-8');
       }
       return res.redirect('/admin/banner/all')
    }
}