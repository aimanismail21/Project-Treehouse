// takes all database profile data to display on profile page
var uid = null;
var displayName = null;


// initialize variable
let is_social_worker = null;
let is_volunteer = null;
let city = null;
let first_name = null;
let last_name = null;
let address = null;
let pets = null;
let family = null;
let room_type = null;
let phone = null;


// initialize page
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
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
    room_type = document.getElementById("roomtype").value;
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
            TypeOfRoom: room_type,
            City: city
        });
        document.getElementById('confirmation').innerHTML = 'info has been written'
    }
}


// validate all form elements
function validate_inputs() {
    let first_name_match = first_name.match(/^([a-z A-z]+)$/i);
    let last_name_match = last_name.match(/^([a-z A-Z]+)$/i);
    let phone_match = phone_number.match(/^((\d){3}(-)(\d){3}(-)(\d){4})$/i);

    if (first_name_match === null) {
        window.alert("Please enter a correct first name. ( only letters )");
        document.getElementById('first_name').focus();
        return false;
    }

    if (last_name_match === null) {
        window.alert("Please enter a correct last name. ( only letters )");
        document.getElementById('last_name').focus();
        return false;
    }

    if (phone_match === null) {
        window.alert("Please enter a correct phone number eg: 999-999-9999.");
        document.getElementById('phone').focus();
        return false;
    }

    if (address === '') {
        window.alert("Please enter your address");
        document.getElementById('address').focus();
        return false;
    }
    return true;
}


// resets info to what is currently in the database
function reset_info() {
    initApp();
    document.getElementById('confirmation').innerHTML = 'info has been reset';
}


// sets room availability in database given no or yes
function set_room_availability(availability) {
    let dbref = firebase.database().ref("Users/" + uid);

    // if availability = yes then availability is set to open in database
    if (availability === 'yes') {
        dbref.update({
            Availability: 'Open'
        });
        document.getElementById('confirmation').innerHTML = 'Room set to Available'
    }
    // if availability = no then availability is set to closed in database
    else if (availability === 'no') {
        dbref.update({
            Availability: 'Closed'
        });
        document.getElementById('confirmation').innerHTML = 'Room set to Not Available'
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
    document.getElementById("roomtype").value = snapshot.child('TypeOfRoom').val();
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


function phone_formatting(ele,restore) {
    var new_number,
        selection_start = ele.selectionStart,
        selection_end = ele.selectionEnd,
        number = ele.value.replace(/\D/g,'');

    // automatically add dashes
    if (number.length > 2) {
        // matches: 123 || 123-4 || 123-45
        new_number = number.substring(0,3) + '-';
        if (number.length === 4 || number.length === 5) {
            // matches: 123-4 || 123-45
            new_number += number.substr(3);
        }
        else if (number.length > 5) {
            // matches: 123-456 || 123-456-7 || 123-456-789
            new_number += number.substring(3,6) + '-';
        }
        if (number.length > 6) {
            // matches: 123-456-7 || 123-456-789 || 123-456-7890
            new_number += number.substring(6);
        }
    }
    else {
        new_number = number;
    }

    // if value is higher than 12, last number is dropped
    // if inserting a number before the last character, numbers
    // are shifted right, only 12 characters will show
    ele.value =  (new_number.length > 12) ? new_number.substring(0,12) : new_number;

    // restore cursor selection,
    // prevent it from going to the end
    // UNLESS
    // cursor was at the end AND a dash was added
    document.getElementById('msg').innerHTML='<p>Selection is: ' + selection_end + ' and length is: ' + new_number.length + '</p>';

    if (new_number.slice(-1) === '-' && restore === false
        && (new_number.length === 8 && selection_end === 7)
        || (new_number.length === 4 && selection_end === 3)) {
        selection_start = new_number.length;
        selection_end = new_number.length;
    }
    else if (restore === 'revert') {
        selection_start--;
        selection_end--;
    }
    ele.setSelectionRange(selection_start, selection_end);

}

function phone_number_check(field,e) {
    var key_code = e.keyCode,
        key_string = String.fromCharCode(key_code),
        press_delete = false,
        dash_key = 189,
        delete_key = [8,46],
        direction_key = [33,34,35,36,37,38,39,40],
        selection_end = field.selectionEnd;

    // delete key was pressed
    if (delete_key.indexOf(key_code) > -1) {
        press_delete = true;
    }

    // only force formatting is a number or delete key was pressed
    if (key_string.match(/^\d+$/) || press_delete) {
        phone_formatting(field,press_delete);
    }
    // do nothing for direction keys, keep their default actions
    else if(direction_key.indexOf(key_code) > -1) {
        // do nothing
    }
    else if(dash_key === key_code) {
        if (selection_end === field.value.length) {
            field.value = field.value.slice(0,-1)
        }
        else {
            field.value = field.value.substring(0,(selection_end - 1)) + field.value.substr(selection_end)
            field.selectionEnd = selection_end - 1;
        }
    }
    // all other non numerical key presses, remove their value
    else {
        e.preventDefault();
//    field.value = field.value.replace(/[^0-9\-]/g,'')
        phone_formatting(field,'revert');
    }

}

document.getElementById('phone').onkeyup = function(e) {
    phone_number_check(this,e);
};