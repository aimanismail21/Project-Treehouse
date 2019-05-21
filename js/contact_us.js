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

        if (name.trim() === ""){  // makes sure the name isn't empty
            alert("Please enter a name.");
            return;
        }

        if (!validate_email(email)){
            alert("Invalid Email!");
            return;
        }

        if (subject.trim() === ""){  // makes sure the subject isn't empty
            alert("Please enter a message.");
            return;
        }

        if (message.trim() === ""){  // makes sure the message isn't empty
            alert("Please enter a message.");
            return;
        }

    console.log(name);
    console.log(email);
    console.log(subject);
    console.log(message);
    firebase.database().ref("FeedbackForm/" + date).set({ // sends the information to the firebase database
        name: name,
        email: email,
        subject: subject,
        message: message,
    });
    document.getElementById("form_message").innerHTML=("Message has been sent!"); // a message appears on the page to tell the user the message has been sent
};

function validate_email(email) {
    let emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/; // makes sure email is in the correct form
    return emailRegex.test(email);
}
