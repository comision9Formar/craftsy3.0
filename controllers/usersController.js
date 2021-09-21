const path = require('path');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
let productos = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','productos.json'),'utf-8'));
let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','usuarios.json'),'utf-8'));

module.exports = {
    register : (req,res) => {
        return res.render('register',{
            title : 'Registro',
            productos
        })
    },
    processRegister : (req,res) => {

        const {nombre,email,password,pais,genero} = req.body;

        let usuario = {
            id : usuarios[usuarios.length-1] ? usuarios[usuarios.length-1].id + 1 :  1,
            nombre : nombre.trim(),
            email : email.trim(),
            password : bcryptjs.hashSync(password, 10),
            pais,
            genero,
            rol : "user"
        }
        usuarios.push(usuario);

        fs.writeFileSync(path.join(__dirname,'..','data','usuarios.json'),JSON.stringify(usuarios,null,2),'utf-8');

        return res.redirect('/users/login')

    },
    login : (req,res) => {
        return res.render('login',{
            title : 'Login',
            productos
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){
            const {email,recordar} = req.body;
            let usuario = usuarios.find(usuario => usuario.email === email);
            req.session.userLogin = {
                id : usuario.id,
                nombre : usuario.nombre,
                rol : usuario.rol
            }
            if(recordar){
                res.cookie('craftsyForEver',req.session.userLogin,{maxAge: 1000 * 60})
            }
            return res.redirect('/')
        }else{
            return res.render('login',{
                title : 'Login',
                productos,
                errores : errors.mapped()
            })
        }
       
    },
    profile : (req,res) => {
        return res.render('profile',{
            title : "Perfil de usuario",
            productos
        })
    },
    logout : (req,res) => {
        req.session.destroy();
        res.cookie('craftsyForEver',null,{maxAge: -1})
        return res.redirect('/')
    }
}