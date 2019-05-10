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
    console.log(name);
    console.log(email);
    console.log(subject)
    console.log(message);
    firebase.database().ref("FeedbackForm/" + date).set({
        name: name,
        email: email,
        subject: subject,
        message: message,
    });
}