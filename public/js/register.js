const $ = id => document.getElementById(id);
let regExLetter = /^[A-Z]+$/i;
let regExEmail =  /^(([^<>()\[\]\.,;:\s@\”]+(\.[^<>()\[\]\.,;:\s@\”]:+)*)|(\”.+\”))@(([^<>()[\]\.,;:\s@\”]+\.)+[^<>()[\]\.,;:\s@\”]{2,})$/;
let regExPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //mayuscula, numero y 6 a 12 caracteres
let regExPass2 = /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/; //mayuscula, numero, especial y 8 a 16 caracteres

const emailVerify = async (email) => {
    try {
        let response = await fetch('http://localhost:3000/api/emails');
        let result = await response.json()

        return result.data.includes(email)
               

    } catch (error) {
        console.log(error)
    }
}



window.addEventListener('load', () => {
    console.log('resgister.js success')

    $('name').addEventListener('focus', () => {
        if($('name').value.trim() === ""){
            $('name-error').innerHTML = "<span><i class='fas fa-info-circle'></i> Solo caracteres alfabéticos</span>"
        }

    })
    $('name').addEventListener('blur', () => {

        switch (true) {
            case !$('name').value.trim():
                $('name-error').innerHTML = "<span><i class='fas fa-exclamation-triangle'></i> El nombre es obligatorio</span>"
                $('name').classList.add('is-invalid')

                break;
            case $('name').value.trim().length < 2 || $('name').value.trim().length > 50 :
                $('name-error').innerText = "Entre 2 y 50 caracteres"
                $('name').classList.add('is-invalid')

                break;
            case !regExLetter.test($('name').value.trim()):
                $('name-error').innerText = "Solo caracteres alfabéticos"
                $('name').classList.add('is-invalid')

                break;
            default:
                $('name').classList.remove('is-invalid')
                $('name').classList.add('is-valid')
                $('name-error').innerText = null
                break;
        }
    })
    $('name').addEventListener('keydown', () => {
        $('name').classList.remove('is-invalid')
        $('name-error').innerText = null
        })


    $('email').addEventListener('blur', async () => {

        switch (true) {
            case !regExEmail.test($('email').value):
                $('email-error').innerText = "Tiene que ser un email válido"
                $('email').classList.add('is-invalid')
                break;
            case await emailVerify($('email').value) :
                $('email-error').innerText = "El email está registrado"
                $('email').classList.add('is-invalid')
                break;
            default:
                $('email-error').innerText = null
                $('email').classList.remove('is-invalid')
                $('email').classList.add('is-valid')
                break;
        }
    })

    $('password').addEventListener('blur',() => {
        if(!regExPass2.test($('password').value)){
            $('password-error').innerText = "La contraseña debe tener una mayúscula, un número y entre 6 y 12 caracteres"
            $('password').classList.add('is-invalid')
        }else{
            $('password-error').innerText = null
            $('password').classList.remove('is-invalid')
            $('password').classList.add('is-valid')
        }
    })
    $('password').addEventListener('focus',()=> {
        $('password').classList.remove('is-invalid')

    })

    $('password2').addEventListener('blur',() => {
        if($('password').value !== $('password2').value){
            $('password2-error').innerText = "Las contraseñas no coinciden"
            $('password2').classList.add('is-invalid')
        }else if($('password').value == ""){
            $('password2-error').innerText = "Debes ingresar una contraseña"
            $('password2').classList.add('is-invalid')
        }else{
            $('password2-error').innerText = null
            $('password2').classList.remove('is-invalid')
            $('password2').classList.add('is-valid')
        }
    })
    $('password2').addEventListener('focus',()=> {
        $('password2').classList.remove('is-invalid')

    })

    $('terminos').addEventListener('click', () => {
        $('terminos').classList.toggle('is-valid');
        $('terminos').classList.remove('is-invalid');
        $('terminos-error').innerHTML = null

    })

    $('form-register').addEventListener('submit', event => {
        event.preventDefault();

        let elementsForm = $('form-register').elements;
        //console.log(elementsForm);
        let error = false;

        for (let i = 0; i < elementsForm.length - 2; i++) {
            
            if(!elementsForm[i].value){
                elementsForm[i].classList.add('is-invalid')
                $('error-empty').innerHTML = "Los campos señalados son obligatorios";
                error = true
            }
        }

        if(!$('terminos').checked) {
            
            $('terminos').classList.add('is-invalid')
            $('terminos-error').innerText = "Debes aceptar los términos y condiciones";
            error = true
        }

        for (let i = 0; i < elementsForm.length - 2; i++) {
            
            if(elementsForm[i].classList.contains('is-invalid')){
                error = true
            }
        }

       

        if(!error){
            $('form-register').submit()
        }
    })


    

})