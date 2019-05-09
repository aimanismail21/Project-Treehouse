// takes all database profile data to display on profile page
var uid = null;
var displayName = null;


// initialize variables
let first_name = null;
let last_name = null;
let city = null;
let address = null;
let phone_number = null;
let email = null;
let household_members = null;
let pets = null;
let type_of_room = null;
let availability = null;
let user_id = null;
let is_social_worker = null;
let is_volunteer = null;
let city_selection = null;
let pets_selection = null;
let family_selection = null;
let volunteer_listing = null;
let house_image = null;
let volunteer_row = null;
let house_cell = null;


// initialize page elements
displayLinks = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
            uid = user.uid;
            let dbref = firebase.database().ref("Users/" + uid);
            dbref.on('value', (snapshot) => {
                is_social_worker = snapshot.child('IsSocialWorker').val();
                is_volunteer = snapshot.child('IsVolunteer').val();

                // only show elements for social workers / volunteers that they should be able to see
                if (is_social_worker) {
                    document.getElementById('guest_room').style.display = 'none';
                    document.getElementById('query_menu').style.display = 'block';
                }
                if (is_volunteer) {
                    document.getElementById('query_menu').style.display = 'none';
                    document.getElementById('guest_room').style.display = 'block';
                }
            });

        } else {

        }
    }, function (error) {
        console.log(error);
    });
};


window.addEventListener('load', function () {
    displayLinks()
});


// displays all volunteers to screen
function displayVolunteers() {
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Users/");
    ref.on(
        "value",
        function (snap) {
            snap.forEach(function (snap) {
                // obtains info for each volunteer from database
                initializeVolunteerInfo(snap);

                // only display info if availability is set to open
                if (availability === 'Open' && is_volunteer) {
                    createVolunteerListing();
                }
            });
        });
}


// reveal dropdown contents when pressed
function dropdown(id) {
    document.getElementById(id).classList.toggle("show");
}


// function to sort volunteer list to only show ones with entered criterion
function update_by_criteria() {
    // clears the volunteers list
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Users/");
    ref.on(
        "value",
        function (snap) {

            snap.forEach(function (snap) {

                // initialize criteria values
                FindVolunteerInfo(snap);

                // obtains info for each volunteer from database
                initializeVolunteerInfo(snap);

                // display volunteers that fit criteria
                if (city == city_selection && pets == pets_selection
                    && household_members == family_selection && availability == "Open" && is_volunteer) {
                    createVolunteerListing();
                }
            });
        });
}


// function to sort volunteer list to only show ones with entered address
function update_by_address() {
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Users/");
    ref.on(
        "value",
        function (snap) {
            snap.forEach(function (snap) {
                // get address entered to search for
                let address_entered = document.getElementById("address").value;

                // only write volunteer with entered address
                if (address_entered === snap.child("Address").val()) {
                    initializeVolunteerInfo(snap);

                    // only display info if availability is set to open
                    if (availability === 'Open' && is_volunteer) {
                        createVolunteerListing();
                    }
                }
            });
        });
}


// updates volunteer listing to only those with selected name input
function update_by_name() {
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Users/");
    ref.on(
        "value",
        function (snap) {
            snap.forEach(function (snap) {
                // get name entered to search for
                let first_name_entered = document.getElementById("first_name").value;
                let last_name_entered = document.getElementById("last_name").value;

                // only write volunteer with entered name
                if (first_name_entered === snap.child("FirstName").val() ||
                    last_name_entered === snap.child("LastName").val()) {
                    // obtains info for each volunteer from database
                    initializeVolunteerInfo(snap);

                    // only display info if availability is set to open
                    if (availability === 'Open' && is_volunteer) {
                        createVolunteerListing();
                    }
                }
            });
        });
}


// create new volunteer listing element
function createVolunteerListing() {
    //initialize variables
    let volunteer_info_cell = document.createElement('td');
    volunteer_row = document.createElement('tr');
    volunteer_listing = document.createElement("table");
    volunteer_listing.appendChild(volunteer_row);

    // retrieve image of house from database and display with volunteer info
    displayHouseImage();

    // set volunteer_listing
    setVolunteerInfo();

    // set volunteer_listing info
    volunteer_info_cell.style = 'font-size: 1em;';
    volunteer_info_cell.innerHTML = '<b>First Name: ' + first_name + '<br>Last Name:' + last_name +
        '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number:' +
        phone_number + '<br>Family Members:' + household_members + '<br>Pets:' + pets + '<br>RoomType: ' +
        type_of_room + '<br> <a href = "mailto: ' + email + '"> Email: ' + email + '</a></b>';

    // append volunteer info to volunteer listing
    volunteer_row.appendChild(volunteer_info_cell);
    volunteer_listing.appendChild(volunteer_row);

    // append volunteer listing to volunteers list
    let linebreak = document.createElement('br');
    document.getElementById('volunteers').appendChild(volunteer_listing);
    document.getElementById('volunteers').appendChild(linebreak)

}

// initialize criteria values
function FindVolunteerInfo(snap) {
    // initialize city to value in database if nothing is selected
    if (document.getElementById('city').value === '') {
        city_selection = snap.child("City").val();
    }
    // if a city is selected take its value
    else {
        city_selection = document.getElementById('city').value
    }

    // initialize pets to value in database if nothing is selected
    if (document.getElementById('pets').value === '') {
        pets_selection = snap.child("Pets").val();
    }
    // if pets is selected take its value
    else {
        pets_selection = document.getElementById('pets').value
    }

    // initialize family to value in database if nothing is selected
    if (document.getElementById('family').value === '') {
        family_selection = snap.child("HouseHoldMembers").val();
    }
    // if family is selected take its value
    else {
        family_selection = document.getElementById('family').value
    }
}

// obtains info for each volunteer from database
function initializeVolunteerInfo(snap) {
    first_name = snap.child("FirstName").val();
    last_name = snap.child("LastName").val();
    city = snap.child("City").val();
    address = snap.child("Address").val();
    phone_number = snap.child("PhoneNumber").val();
    email = snap.child("Email").val();
    household_members = snap.child("HouseHoldMembers").val();
    pets = snap.child("Pets").val();
    type_of_room = snap.child("TypeOfRoom").val();
    availability = snap.child("Availability").val();
    user_id = snap.key;
    is_social_worker = snap.child('IsSocialWorker').val();
    is_volunteer = snap.child('IsVolunteer').val();
}


// gets house image from database and creates a data cell to hold it
function displayHouseImage() {
    house_cell = document.createElement('td');
    house_cell.style.width = '220px';
    var storageRef = firebase.storage().ref();
    storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
        house_image = document.createElement('img');
        house_image.src = url;
        house_image.style = 'width: 214px; height: 214px;';
        house_cell.appendChild(house_image);
    }).catch(function (error) {

    });
    volunteer_row.appendChild(house_cell);
}


// initializes the volunteer_listing element
function setVolunteerInfo() {
    volunteer_listing.setAttribute("class", "volunteer_info");
    volunteer_listing.style = 'display: block; overflow-x: auto; white-space: nowrap;' +
        'overflow-y: auto; height: 220px; width: 100%;';
    volunteer_listing.style.border = '2px solid black';
    volunteer_listing.onclick = function () {
        // - go to volunteers profile
    };
}