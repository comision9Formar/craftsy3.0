const $ = id => document.getElementById(id);
let regExLetter = /^[A-Z]+$/i

window.addEventListener('load', () => {
    console.log('resgister.js success')

    $('name').addEventListener('focus', () => {
        $('name-error').innerHTML = "<span><i class='fas fa-info-circle'></i> Solo caracteres alfabéticos</span>"
        $('name-error').classList.toggle('alert-info')

    })
    $('name').addEventListener('blur', () => {

        switch (true) {
            case !$('name').value.trim():
                $('name-error').innerText = "El nombre es obligatorio!"
                $('name-error').classList.add('alert')
                $('name-error').classList.add('alert-danger')
                $('name').classList.add('is-invalid')

                break;
            case $('name').value.trim().length < 2 || $('name').value.trim().length > 50 :
                $('name-error').innerText = "Entre 2 y 50 caracteres"
                $('name-error').classList.add('alert-danger')
                $('name').classList.add('is-invalid')

                break;
            case !regExLetter.test($('name').value.trim()):
                $('name-error').innerText = "Solo caracteres alfabéticos"
                $('name-error').classList.add('alert-danger')
                $('name').classList.add('is-invalid')

                break;
            default:
                $('name-error').classList.remove('alert-danger')
                $('name').classList.remove('is-invalid')
                $('name').classList.add('is-valid')
                $('name-error').innerText = null
                break;
        }
    })
    $('name').addEventListener('keydown', () => {
        $('name-error').classList.remove('alert-danger')
        $('name').classList.remove('is-invalid')
        $('name-error').innerText = null
        })

})