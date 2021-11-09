console.log('formProductEdit success');
const $ = id => document.getElementById(id);


    const showPreview = data => {
        $('preview').innerHTML = null;
        data.length >= 3 ? $('btn-add-image').classList.add('disabled') : $('btn-add-image').classList.remove('disabled');
         data.forEach(image => {
            
            $('preview').innerHTML +=
            `
            <div class="col-12 col-md-6 text-center">
                <img src="/images/${image.file}" alt="" height="100" class="img-responsive">
                <div>
                    <button onclick="deleteImage(${image.id})" class="btn btn-sm btn-danger">Eliminar</button>
                </div>
            </div>
            `
        })
    }


    const deleteImage = async id => {
        try {
            let response = await fetch('/api/products/delete-image/' + id);
            let result = await response.json()
            console.log(result)
            showPreview(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const addImage = async (id,files) => {
        console.log(files)
        var data = new FormData();
        console.log(data)
        for (const file of files) {
            data.append('images',file,file.name)
        }
        console.log(data)

        try {
            let response = await fetch('/api/products/add-images/' + id,{
                method : 'POST',
                body : data
            });
            let result = await response.json()
            showPreview(result.data)
        } catch (error) {
            console.log(error)
        }
    }
