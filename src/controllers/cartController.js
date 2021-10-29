const getURL = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`;
const db = require('../database/models');

const productVerify = (cart,id) => {
    let index = -1;

    for (let i = 0; i < cart.length; i++) {
        
        if(cart[i].id === id){
            index = i
            break
        }
    }
    return index
}

module.exports = {
    show : (req,res) => {
        let response = {
            meta : {
                link : getURL(req)
            },
            data : req.session.cart
        }
        return res.status(200).json(response)
    },
    add : async (req,res) => {

        try {
            let product = await db.Product.findByPk(req.params.id,{
                include : ['category','images']
            })
    
            let item = {
                id : +product.id,
                nombre : product.name,
                imagen : product.images[0].file,
                precio : product.price,
                categoria : product.category.name,
                cantidad : 1,
                subtotal : product.price 
            }

            if(req.session.cart.length === 0){
                let order = await db.Order.findOne({
                    where : {
                        userId : req.session.userLogin.id,
                        status : 'pending'
                    }
                })
        
                if(!order){
                    order = await db.Order.create({
                        userId: req.session.userLogin.id,
                        status : 'pending'
                    })
                }

                item = {
                    ...item,
                    orderId : order.id
                }

                req.session.cart.push(item)
            }else{
                let index = productVerify(req.session.cart,req.params.id)
                let order = await db.Order.findOne({
                    where : {
                        userId : req.session.userLogin.id,
                        status : 'pending'
                    }
                })

                if(index === -1){
                    item = {
                        ...item,
                        orderId : order.id
                    }
                    req.session.cart.push(item)

                }else{
                    let product = req.session.cart[index]

                    product.cantidad++
                    product.subtotal = product.cantidad * product.precio

                    req.session.cart[index] = product
                }
            }

            let response = {
                meta : {
                    link : getURL(req)
                },
                data : req.session.cart
            }
            return res.status(200).json(response)
    
        } catch (error) {
            console.log(error)
        }
       
    }
}