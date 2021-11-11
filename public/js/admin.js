console.log('admin connected success');

const $ = id => document.getElementById(id);

    let table = $('table');
    let filter = $('select-filter');
    let order = $('select-order');
    let limit = $('select-limit');
    let search = $('input-search');
    let total =  $('total-products');
    let boxPaginator = $('box-paginator');

    const getAllProducts = async () => {
        let response = await fetch(window.origin + `/api/products-all`);
        let products = await response.json()
        localStorage.setItem('products',JSON.stringify(products.data))
    }
    getAllProducts()

    /* getProducts recibe:  filter, limit, show, current, initial, search, order */
    const getProducts = async (filter,limit,show,current,initial,search,order='id') => {
        try {
            let response = await fetch(window.origin + `/api/products?search=${search}&filter=${filter}&limit=${limit}&order=${order}&current=${current}`);
            let products = await response.json()
            table.innerHTML = null;
            total.innerHTML = null
            total.innerHTML = products.meta.total + ' mostrados'
    
            products.data.forEach( product => {
                addItem(product)
            })
    
                /* 
                total: cantidad total productos 
                limit : cuantos productos quiero mostrar por página
                show : cuantas paginas voy a mostrar por bloque
                current : la pagina donde estoy parado
                initial : la primera pagina del bloque
                */
            pagination(products.meta.total,limit, show, current,initial)
        } catch (error) {
            console.log(error)
        }
     
    }

    getProducts(0,10,6,1,1)

  
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

        /* getProducts recibe:  filter, limit, show, current, initial, search, order */

    filter.addEventListener('change', e => {
        getProducts(e.target.value,limit.value,6,1,1,search.value,order.value)
    })
    
    order.addEventListener('change', e => {
        getProducts(filter.value,limit.value,6,1,1,search.value,e.target.value)
    })

    limit.addEventListener('change', e => {
        getProducts(filter.value,e.target.value,6,1,1,search.value,order.value)
    })

    search.addEventListener('keyup', async  e => {
        if(e.target.value.length >= 3){
            let response = await fetch(window.origin + `/api/search?search=${e.target.value}&filter=${filter.value}&limit=${limit.value}&order=${order.value}`);
            let products = await response.json()
            console.log(products)
            table.innerHTML = null
            total.innerHTML = null
            total.innerHTML = products.meta.total + ' mostrados'
            
            products.data.forEach( product => {
                addItem(product)
            })
        }
    })


    /* paginador */

    /* 
    total: cantidad total productos 
    limit : cuantos productos quiero mostrar por página
    show : cuantas paginas voy a mostrar por bloque
    current : la pagina donde estoy parado
    initial : la primera pagina del bloque
    */

    const pagination = (total,limit,show,current,initial) => {
        let pages = Math.ceil(total / limit);
        boxPaginator.innerHTML = null;
        if(initial > 1) {
            boxPaginator.innerHTML = `
            <li class="page-item mx-2" >
                <a class="page-link" href="#" onclick="goFirst(event,${total},${limit},${show})"><i class="fas fa-angle-left"></i></a>
            </li>
            <li class="page-item" >
                <a class="page-link" href="#" onclick="goPageLast(event,${total}, ${limit}, ${show}, ${current}, ${initial})"><i class="fas fa-angle-double-left"></i></a>
            </li>`;
        }

        for (let i = initial; i <= initial + show; i++) {
            if(i <= pages){
                let page = `
                <li class="page-item ${current == i ? "active" : ""}" id="pag${i}">
                    <a class="page-link"  href="#" onclick="goPage(event,${i},${limit},${initial},${show})">${i}</a>
                </li>
                `
                boxPaginator.innerHTML += page
            }

        }

        if(initial + show < pages){
            boxPaginator.innerHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="goPagesNext(event, ${total}, ${limit}, ${show}, ${current}, ${initial})" ><i class="fas fa-angle-double-right"></i></a>
            </li>
            <li class="page-item goLast mx-2">
                <a class="page-link" href="#" onclick="goLast(event,${total},${limit},${show},${pages})"><i class="fas fa-angle-right"></i></a>
            </li>
            `
        }

        boxPaginator.innerHTML += `<p class="text-primary small ms-2 mt-1">pág. ${current} de ${pages}</p>`;
    } 


        /* getProducts recibe:  filter, limit, show, current, initial, search, order */

    const goPage = async (event,current,limit,initial,show,order=$('select-order').value,filter=$('select-filter').value,search=$('input-search').value) => {
        event.preventDefault();
        try {
            let response = await fetch(window.origin + `/api/products?search=${search}&filter=${filter}&limit=${limit}&order=${order}&current=${current}`);
            let products = await response.json()
            console.log(products)
            table.innerHTML = null;
            total.innerHTML = null
            total.innerHTML = products.meta.total + ' mostrados'
    
            products.data.forEach( product => {
                addItem(product)
            })
            pagination(products.meta.total,limit, show, current,initial)
        } catch (error) {
            console.log(error)
        }
    }

    const goPagesNext = (event, total, limit, show, current, initial) => {
        event.preventDefault();
        current = current + show;
        initial = initial + show;
        boxPaginator.innerHTML = null;
        //pagination(total, limit, show, current, initial);
        goPage(event, current, limit, initial,show);
      };
      
      const goPageLast = (event, total, limit, show, current, initial) => {
        event.preventDefault();
        current = current - show;
        initial = initial - show;
        boxPaginator.innerHTML = null;
        //pagination(total, limit, show, current, initial);
        goPage(event, current, limit, initial,show);
      };


      const goFirst = (event, total, limit, show) => {
        event.preventDefault();
        boxPaginator.innerHTML = null;
        //pagination(total, limit, show, 1, 1);
        goPage(event, 1, limit, 1,show);
      };
      
      const goLast = (event, total, limit, show, pages) => {
        event.preventDefault();
        boxPaginator.innerHTML = null;
        let current = pages;
        let initial = pages - show;
        goPage(event, current, limit, initial,show);
      
        //pagination(total, limit, show, current, initial);
      };
