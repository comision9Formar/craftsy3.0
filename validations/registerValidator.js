const {body,check} = require('express-validator');
const db = require('../database/models')


module.exports = [
    body('email')
    .custom( value => {
       
        return db.User.findOne({
            where : {
                email : value
            }
        })
            .then(user => {
                if(user){
                    return Promise.reject('El email ya se encuentra registrado')
                }
            })
    })
]