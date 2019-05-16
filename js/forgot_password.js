
//Reset password link is sent to email entered by user in forgot_password.html input box
function forgot_password(){
    var email = document.getElementById("example_input_email1");
    let input = email.value;
    console.log(email.value);
    firebase.auth().sendPasswordResetEmail(input).then(function() {
        // Email sent.
    }).catch(function(error) {
        // An error happened.
    })}

