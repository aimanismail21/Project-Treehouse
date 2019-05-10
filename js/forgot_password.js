//Reset password email is sent.
function forgotPassword(){
    var email = document.getElementById("exampleInputEmail1");
    let input = email.value;
    console.log(email.value);
    firebase.auth().sendPasswordResetEmail(input).then(function() {
        // Email sent.
    }).catch(function(error) {
        // An error happened.
    })}

