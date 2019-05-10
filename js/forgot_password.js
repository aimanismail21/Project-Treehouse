//Reset password email is sent
function forgot_password(){
    var email = document.getElementById("example_email");
    let input = email.value;
    console.log(email.value);
    firebase.auth().sendPasswordResetEmail(input).then(function() {
        // Email sent.
    }).catch(function(error) {
        // An error happened.
    })}

