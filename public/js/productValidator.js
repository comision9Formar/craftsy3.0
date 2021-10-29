console.log('productValidator.js success')
const $ = id => document.getElementById(id);

let description = $('descripcion');

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