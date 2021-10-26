window.addEventListener('load', () => {

    let imgPreview = document.getElementById('img-preview');
    let inputAvatar = document.getElementById('input-avatar');
    let formProfile = document.getElementById('form-profile');


    inputAvatar.addEventListener('change', (e) => {

        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = () => imgPreview.src = reader.result
    })

    formProfile.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            let response = await fetch('/api/verify-password',{
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    email : e.target.email.value,
                    password : e.target.password.value
                })
            })
            let result = await response.json();

            if(!result.response){
                alert('contraseña incorrecta!!')
            }else{
                formProfile.submit()
            }

        } catch (error) {
            console.log(error)
        }

    })

})