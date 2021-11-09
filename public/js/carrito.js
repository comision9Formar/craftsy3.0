let spanCantidad = $('span-cantidad')
let changuito = $('changuito')
let spanTotal = $('total')
let cartHead = $('cart-head')
let cartFooter = $('cart-footer')
let cartEmpty = $('cart-empty')
let btnCartEmpty = $('btn-cart-empty')
let btnNextBuy = $('btn-next-buy')


const mostrarCantidad = cart => {
    var cantidad = 0;
    var total = 0;

    if(cart){
        cart.forEach(item => {
            cantidad += item.cantidad;
            total += item.subtotal 
        })
    }


    spanCantidad.innerHTML = cantidad
    spanTotal.innerHTML = `<span>$</span><span class="float-end">${total}</span>`;

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

const cargarTabla = carrito => {
    changuito.innerHTML = null;
    carrito.forEach(producto => {
        let item = `
            <td class="col-2">
            <img class="w-100" src="/images/${producto.imagen}" id="imgProduct"> 
            </td>
            <td class="text-center col-3 align-middle">
            <a class="text-danger h5" onClick="removeItem(event,${producto.id})"><i class="fas fa-minus-square"></i></a>
            <span class="h5">${producto.cantidad}<span>
            <a class="text-success h5" onClick="addItem(event,${producto.id})"><i class="fas fa-plus-square"></i></a>
            </td>
            <td class="align-middle">
            ${producto.nombre}
            </td>
           
            <td class="align-middle">
            <span>$</span><span class="float-end">${producto.precio}</span>
            </td>
            <td class="align-middle">
            <span>$</span><span class="float-end">${producto.subtotal}</span>
            </td>
            `;
        changuito.innerHTML += item
    });
    return false
}



const getCarrito = async () => {
    try {
        let response = await fetch('/api/cart/show')
        let result = await response.json()
        cargarTabla(result.data)
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
        cargarTabla(result.data)
        mostrarCantidad(result.data)

    } catch (error) {
        console.log(error)
    }
}

const removeItem = async (e,id) => {
    e.preventDefault()

    try {
        let response = await fetch('/api/cart/remove/' + id)
        let result = await response.json()
        cargarTabla(result.data)
        mostrarCantidad(result.data)
    
    } catch (error) {
        console.log(error)
    }
}

const emptyCart = async () => {
    try {
        let response = await fetch('/api/cart/empty')
        let result = await response.json()
        changuito.innerHTML = null
        mostrarCantidad(result.data)
    } catch (error) {
        console.log(error)

    }
}

btnCartEmpty.addEventListener('click', () => emptyCart())

getCarrito()