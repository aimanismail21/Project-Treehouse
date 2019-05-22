// Reset password link is sent to email entered by user
function is_valid(){
    var email = document.getElementById("example_input_email1");
    if (!reg_exp(email.value)){
        alert("Invalid Email!");
        return false;
    }
    else {
        forgot_password();
        window.location.href = "confirmation_forget_password.html";
    }
}


// Checks if email entered is valid
function reg_exp(valid_email){
    var email_regex =/^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,})$/;
    return email_regex.test(valid_email);
}


//Reset password link is sent to email entered by user in forgot_password.html input box
function forgot_password(){
    var email = document.getElementById("example_input_email1");
    let input = email.value;
    console.log(email.value);
    firebase.auth().sendPasswordResetEmail(input).then(function() {
        // Email sent.
    }).catch(function(error) {
        // An error happened.
    });
}

