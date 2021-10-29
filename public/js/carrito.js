let spanCantidad = $('span-cantidad')
let changuito = $('changuito')
let total = $('total')
let cartHead = $('cart-head')
let cartFooter = $('cart-footer')
let cartEmpty = $('cart-empty')
let btnCartEmpty = $('btn-cart-empty')
let btnNextBuy = $('btn-next-buy')


const mostrarCantidad = cart => {
    var cantidad = cart.length;

    spanCantidad.innerHTML = cantidad

    if(cantidad === 0){
        cartHead.style.display = "none"
        cartFooter.style.display = "none"
        cartEmpty.style.display = "block"
        btnCartEmpty.classList.add('disabled')
        btnNextBuy.classList.add('disabled')
    }else{
        cartHead.style.display = "table-header-group"
        cartFooter.style.display = "table-footer-group"
        cartEmpty.style.display = "none"
        btnCartEmpty.classList.remove('disabled')
        btnNextBuy.classList.remove('disabled')
    }
}



const getCarrito = async () => {
    try {
        let response = await fetch('/api/cart/show')
        let result = await response.json()

        mostrarCantidad(result.data)

    } catch (error) {
        console.log(error)
    }
}

const addItem = async (e,id) => {
    e.preventDefault()

    try {
        let response = await fetch('/api/cart/add/' + id)
        let result = await response.json()

        mostrarCantidad(result.data)

    } catch (error) {
        console.log(error)
    }
}



getCarrito()