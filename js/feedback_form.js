var name_form = document.getElementById("name");
var email_form = document.getElementById("email");
var subject_form = document.getElementById("subject");
var message_form = document.getElementById("message");
var submitBtn = document.getElementById("form_submit");

submitBtn.onclick = function()  {
    var name = name_form.value;
    var email = email_form.value;
    var subject = subject_form.value;
    var message = message_form.value;
    var date = new Date();

    let flag = 1;

        let emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/; // makes sure email is in the correct form
        let valid_email = emailRegex.test(email);
        if (!valid_email){
            flag = 0;
        }

        if (message === ""){  // makes sure the message isn't empty
            flag = 0;
        }

        if (flag === 0) {
            alert("Invalid Email or message");
            return;
        }

    console.log(flag);
    console.log(name);
    console.log(email);
    console.log(subject);
    console.log(message);
    firebase.database().ref("FeedbackForm/" + date).set({
        name: name,
        email: email,
        subject: subject,
        message: message,
    });
    document.getElementById("form_message").innerHTML=("Message has been sent!");
};