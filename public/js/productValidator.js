console.log('productValidator.js success')
const $ = id => document.getElementById(id);

let description = $('descripcion');
let imagenes = $('imagen');
let preview = $('preview');

const regExExt = /(.jpg|.png|.webp)$/i;


description.addEventListener('blur', () => {
    switch (true) {
        case description.value.length < 20:
            description.classList.add('is-invalid')
            $('error-description').innerHTML = "La description debe tener un mínimo de 20 caracteres";
            description.classList.remove('is-valid');

            break
        default:
            description.classList.remove('is-invalid');
            description.classList.add('is-valid');
            $('error-description').innerHTML = "";
    }
})

imagenes.addEventListener('change', function(e) {
    switch (true) {
        case !regExExt.exec(this.value):
            imagenError.innerHTML = "Solo imágenes con extensión jpg, png, webp"
            this.classList.add('is-invalid');
            preview.innerHTML = null
            break;
        case this.files.length > 3 :
            imagenError.innerHTML = "Solo se permiten 3 imágenes"
            this.classList.add('is-invalid');
            preview.innerHTML = null
            break
        default:
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            imagenError.innerHTML = null;
            btnImages.innerText = "Cambiar imágenes"

            if(this.files) {
                [].forEach.call(this.files,readAndPreview)
            }

            function readAndPreview(file) {
                var reader = new FileReader();
                preview.innerHTML = null;
                reader.addEventListener('load',function() {
                    var image = new Image()
                    image.height = 100;
                    image.title = file.name;
                    image.src = this.result;
                    preview.appendChild(image)
                })
                reader.readAsDataURL(file)
            }


            break;
    }
})
