const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');
let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','usuarios.json'),'utf-8'));

module.exports = {
    register : (req,res) => {
        return res.render('register',{
            title : 'Registro',
        })
    },
    processRegister : (req,res) => {

        let errors = validationResult(req)

        if(errors.isEmpty()){
            const {name,email,password} = req.body;
            db.User.create({
                name : name.trim(),
                email,
                password : bcryptjs.hashSync(password, 10),
                avatar : 'default.png',
                rolId : 2,
            })
                .then(user => {
                    req.session.userLogin = {
                        id : user.id,
                        name : user.name,
                        avatar : user.avatar,
                        rolId : user.rolId
                    }
                    return res.redirect('/')
                })
                .catch(error => console.log(error))
        }else{
            return res.render('register',{
                title : 'Registro',
                errores : errors.mapped()
            })
        }
    },
    login : (req,res) => {
        return res.render('login',{
            title : 'Login',
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            const {email,recordar} = req.body;
            db.User.findOne({
                where : {
                    email
                }
            })
                .then(user => {
                    req.session.userLogin = {
                        id : user.id,
                        name : user.name,
                        avatar : user.avatar,
                        rolId : user.rolId
                    }
                    if(recordar){
                        res.cookie('craftsyForEver',req.session.userLogin,{maxAge: 1000 * 60})
                    }
                    return res.redirect('/')
                })
                .catch(error => console.log(error))
        }else{
            return res.render('login',{
                title : 'Login',
                errores : errors.mapped()
            })
        }
    },
    profile : (req,res) => {
        return res.render('profile',{
            title : "Perfil de usuario",
        })
    },
    logout : (req,res) => {
        req.session.destroy();
        res.cookie('craftsyForEver',null,{maxAge: -1})
        return res.redirect('/')
    }
}