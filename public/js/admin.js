console.log('admin connected success');

const $ = id => document.getElementById(id);



window.addEventListener('load', () => {

    let table = $('table');
    let filter = $('select-filter');
    let order = $('select-order');
    let limit = $('select-limit');
    let search = $('input-search');

    const getAllProducts = async () => {
        let response = await fetch(window.origin + `/api/products-all`);
        let products = await response.json()
        localStorage.setItem('products',JSON.stringify(products.data))
    }
    getAllProducts()


    const getProducts = async (filter,limit,order='id') => {
        let response = await fetch(window.origin + `/api/products?filter=${filter}&limit=${limit}&order=${order}`);
        let products = await response.json()
        table.innerHTML = null

        products.data.forEach( product => {
            addItem(product)
        })
    }

    getProducts(0,10)

  

    const addItem = product => {
        let item = `
        <tr>
        <th scope="row">${product.id}</th>
        <td><img width="100" src="/images/${product.images[0].file}" alt=""></td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.category.name}</td>
        <td class="d-flex justify-content-around">
            <a class="btn btn-sm btn-success"
            href="/products/edit/${product.id}"><i class="fas fa-edit"></i></a>
        <div>
            <form
                action="/products/delete/${product.id}?_method=DELETE"
                method="POST">
                <button class="btn btn-sm btn-danger"
                    type='submit'><i class="fas fa-trash-alt"></i></button>
            </form>
        </div>
        </td>
      </tr>
        `
        table.innerHTML += item;
    }

    filter.addEventListener('change', e => {
        getProducts(e.target.value,limit.value,order.value)
    })
    
    order.addEventListener('change', e => {
        getProducts(filter.value,limit.value,e.target.value)
    })

    limit.addEventListener('change', e => {
        getProducts(filter.value,e.target.value,order.value)
    })

    search.addEventListener('keyup',  e => {
        const products = JSON.parse(localStorage.getItem('products'));
        if(e.target.value.length >= 3){
            let result = products.filter(product => product.name.toLowerCase().includes(e.target.value))
            console.log(result)
            table.innerHTML = null
    
            
            result.forEach( product => {
                addItem(product)
            })
        }
       
    })

})