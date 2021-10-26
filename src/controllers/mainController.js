const fs = require('fs');
const path = require('path');
let banner = require('../data/banner.json');

const db = require('../database/models');
const {Op} = require('sequelize');

module.exports = {
    index : (req,res) => {
        let usado = db.Category.findOne({
            where : {
                name : 'usado'
            },
            include : [
                {
                    association : 'products',
                    include : [
                       {association : 'category'},
                       {association : 'images'}
                    ]
                }
            ]
        })
        let nuevo = db.Category.findOne({
            where : {
                name : 'nuevo'
            },
            include : [
                {
                    association : 'products',
                    include : [
                        {association : 'category'},
                        {association : 'images'}
                    ]
                }
            ]
        })
        let refaccionado = db.Category.findOne({
            where : {
                name : 'refaccionado'
            },
            include : [
                {
                    association : 'products',
                    include : [
                        {association : 'category'},
                        {association : 'images'}
                    ]
                }
            ]
        })
        Promise.all([nuevo,usado,refaccionado])
    
            .then(([nuevo,usado,refaccionado]) => {
                return res.render('index',{
                    title : "Craftsy",
                    nuevos : nuevo.products,
                    usados : usado.products,
                    refaccionados : refaccionado.products,
                    banner
                })
            })
            .catch(error => console.log(error)) 
    },
    search : (req,res) => {
            db.Product.findAll({
                include : ['category','images'],
                where : {
                    [Op.or] : [
                        {
                            name : {
                                [Op.substring] : req.query.busqueda
                            }
                        },
                        {
                            description : {
                                [Op.substring] : req.query.busqueda
                            }
                        }
                    ]
                }
            })
                .then(products => {
                    return res.render('result',{
                        title : "Resultado de la búsqueda",
                        products,
                        busqueda : req.query.busqueda
                    })
                })
                .catch(error => console.log(error)) 
       
    },
    admin : (req,res) => {
        db.Category.findAll()
            .then(categories => {
                return res.render('admin/admin',{
                    categories
                })
            })
            .catch(error => console.log(error))
      
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