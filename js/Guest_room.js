// takes all database profile data to display on profile page
var uid = null;
var display_name = null;


// initialize variable
let is_social_worker = null;
let is_volunteer = null;
let city = null;
let first_name = null;
let last_name = null;
let address = null;
let pets = null;
let family = null;
let phone = null;


// initialize page
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            display_name = user.displayName;
            uid = user.uid;
            let dbref = firebase.database().ref("Users/" + uid);
            dbref.on('value', (snapshot) => {
                // initialize page elements with data from database
                initialize_info(snapshot);

                // initialize elements user should be able to see
                initialize_elements(snapshot);
            });

        } else {
            // do nothing
        }
    }, function (error) {
        console.log(error);
    });
};


window.addEventListener('load', function () {
    initApp()
});


// update info of volunteer guest room in database
function update_info() {


    city = document.getElementById("city").value;
    pets = document.getElementById("pets").value;
    family = document.getElementById("family").value;
    first_name = document.getElementById("first_name").value;
    last_name = document.getElementById("last_name").value;
    address = document.getElementById("address").value;
    phone_number = document.getElementById("phone").value;

    if (validate_inputs()) {
        // sets entered info to associated user id in database
        let dbref = firebase.database().ref("Users/" + uid);
        dbref.update({
            FirstName: first_name,
            LastName: last_name,
            Address: address,
            HouseHoldMembers: family,
            Pets: pets,
            PhoneNumber: phone_number,
            City: city
        });
    }

}


// validate all form elements
function validate_inputs() {
    let first_name_match = first_name.match(/^([a-z A-z]+)$/i);
    let last_name_match = last_name.match(/^([a-z A-Z]+)$/i);
    let phone_match = phone_number.match(/^((\d){3}(-)(\d){3}(-)(\d){4})$/i);

    if (first_name_match === null) {
        window.alert("Please enter a correct first name. ( only letters )");
        return false;
    }

    if (last_name_match === null) {
        window.alert("Please enter a correct last name. ( only letters )");
        return false;
    }

    if (phone_match === null) {
        window.alert("Please enter a correct phone number eg: 999-999-9999.");
        return false;
    }

    if (address === '') {
        window.alert("Please enter your address");
        return false;
    }
    return true;
}


// resets info to what is currently in the database
function reset_info() {
    initApp();

}


// sets room availability in database given no or yes
function set_room_availability(availability) {

    let dbref = firebase.database().ref("Users/" + uid);

    // if availability = yes then availability is set to open in database
    if (availability === 'yes') {
        dbref.update({
            Availability: 'Open'
        });
    }
    // if availability = no then availability is set to closed in database
    else if (availability === 'no') {
        dbref.update({
            Availability: 'Closed'
        });
    }

}


// submit house image to storage
function submit_image() {
    var fileButton = document.getElementById("fileButton");
    var file = fileButton.files[0];
    var new_file = new File([file], 'house_image', {
        type: 'image/jpeg',
    });
    var storageRef = firebase.storage().ref(uid + '/' + new_file.name);
    storageRef.put(new_file);
}


// initialize page elements with data from database
function initialize_info(snapshot) {
    document.getElementById("first_name").value = snapshot.child('FirstName').val();
    document.getElementById("last_name").value = snapshot.child('LastName').val();
    document.getElementById("city").value = snapshot.child('City').val();
    document.getElementById("pets").value = snapshot.child('Pets').val();
    document.getElementById("family").value = snapshot.child('HouseHoldMembers').val();
    document.getElementById("address").value = snapshot.child('Address').val();
    document.getElementById("phone").value = snapshot.child('PhoneNumber').val();
}


// initialize page elements
function initialize_elements(snapshot) {
    // get info on user type
    is_social_worker = snapshot.child('IsSocialWorker').val();
    is_volunteer = snapshot.child('IsVolunteer').val();

    // only show elements for social workers / volunteers that they should be able to see
    if (is_volunteer) {
        document.getElementById('query_menu').style.display = 'none';
        document.getElementById('guest_room').style.display = 'block';
    }

    if (is_social_worker) {
        document.getElementById('guest_room').style.display = 'none';
        document.getElementById('query_menu').style.display = 'block';
    }
}