// takes all database profile data to display on profile page
var uid = null;
var display_name = null;


// initialize variables
let first_name = null;
let last_name = null;
let city = null;
let address = null;
let phone_number = null;
let email = null;
let household_members = null;
let pets = null;
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
let house_cell = [];
let house_counter = 0;
let first_name_entered = null;
let last_name_entered = null;
let address_entered = null;


// initialize page elements
displayLinks = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            display_name = user.displayName;
            uid = user.uid;
            let dbref = firebase.database().ref("Users/" + uid);
            dbref.on('value', (snapshot) => {
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


function update_listings(){
    // clears the volunteers list
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Users/");
    ref.on(
        "value",
        function (snap) {

            snap.forEach(function (snap) {

                // get address entered to search for
                address_entered = document.getElementById("address").value;

                // get name entered to search for
                first_name_entered = document.getElementById("first_name").value;
                last_name_entered = document.getElementById("last_name").value;

                // initialize criteria values
                FindEnteredInfo(snap);

                // obtains info for each volunteer from database
                initializeVolunteerInfo(snap);

                // display volunteers that fit criteria
                if (city.toLowerCase() == city_selection.toLowerCase() && pets.toLowerCase() == pets_selection.toLowerCase()
                    && household_members.toLowerCase() == family_selection.toLowerCase() && availability == "Open"
                    && address_entered.toLowerCase() === snap.child("Address").val().toLowerCase() && is_volunteer
                    && (first_name_entered.toLowerCase() === snap.child("FirstName").val().toLowerCase()
                    || last_name_entered.toLowerCase() === snap.child("LastName").val().toLowerCase())) {
                    createVolunteerListing();
                }
            });
        });

}


// create new volunteer listing element
function createVolunteerListing() {
    //initialize variables
    let volunteer_info_cell = document.createElement('td');
    volunteer_info_cell.className = 'volunteer_text';
    volunteer_info_cell.id = 'test';
    volunteer_row = document.createElement('tr');
    volunteer_listing = document.createElement("table");
    volunteer_listing.appendChild(volunteer_row);

    // retrieve image of house from database and display with volunteer info
    displayHouseImage();

    // set volunteer_listing
    setVolunteerInfo();

    // set volunteer_listing info
    volunteer_info_cell.innerHTML = '<b>First Name: ' + first_name + '<br>Last Name: ' + last_name +
        '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number: ' +
        phone_number + '<br>Family Members: ' + household_members + '<br>Pets: ' + pets +
        '<br> <a href = "mailto: ' + email + '"> Email: ' + email + '</a></b>';
    // append volunteer info to volunteer listing
    volunteer_row.appendChild(volunteer_info_cell);
    volunteer_listing.appendChild(volunteer_row);

    // append volunteer listing to volunteers list
    let linebreak = document.createElement('br');
    document.getElementById('volunteers').appendChild(volunteer_listing);
    document.getElementById('volunteers').appendChild(linebreak);

}


// initialize criteria values
function FindEnteredInfo(snap) {
    FindCityEntered(snap);
    FindPetsEntered(snap);
    FindFamilyEntered(snap);
    FindNameEntered(snap);
    FindAddressEntered(snap);
}


// finds user input for first and last name
function FindNameEntered(snap) {
    // initialize first name to value in database if nothing is selected
    if (document.getElementById('first_name').value === '' &&
        document.getElementById('last_name').value === '') {
        first_name_entered = snap.child("FirstName").val();
        last_name_entered = snap.child("LastName").val();
    }

    // only last name entered
    if (document.getElementById('first_name').value === '' &&
        document.getElementById('last_name').value !== '') {
        last_name_entered = document.getElementById('last_name').value;
    }

    // only first name entered
    if (document.getElementById('first_name').value !== '' &&
        document.getElementById('last_name').value === '') {
        first_name_entered = document.getElementById('first_name').value;
    }
}


// finds user input for city
function FindCityEntered(snap){
    // initialize city to value in database if nothing is selected
    if (document.getElementById('city').value === '') {
        city_selection = snap.child("City").val();
    }
    // if a city is selected take its value
    else {
        city_selection = document.getElementById('city').value;
    }
}


// finds user input for pets
function FindPetsEntered(snap){
    // initialize pets to value in database if nothing is selected
    if (document.getElementById('pets').value === '') {
        pets_selection = snap.child("Pets").val();
    }
    // if pets is selected take its value
    else {
        pets_selection = document.getElementById('pets').value;
    }
}


// find user input for family
function FindFamilyEntered(snap){
    // initialize family to value in database if nothing is selected
    if (document.getElementById('family').value === '') {
        family_selection = snap.child("HouseHoldMembers").val();
    }
    // if family is selected take its value
    else {
        family_selection = document.getElementById('family').value;
    }
}


// find user input for address
function FindAddressEntered(snap){
    // initialize city to value in database if nothing is selected
    if (document.getElementById('address').value === '') {
        address_entered = snap.child("Address").val();
    }
    // if a city is selected take its value
    else {
        address_entered = document.getElementById('address').value;
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
    availability = snap.child("Availability").val();
    user_id = snap.key;
    is_social_worker = snap.child('IsSocialWorker').val();
    is_volunteer = snap.child('IsVolunteer').val();
}


// gets house image from database and creates a data cell to hold it
function displayHouseImage() {
    house_cell[house_counter] = document.createElement('td');
    house_cell[house_counter].id = house_counter;
    house_cell[house_counter].className = 'house_cell';
    var storageRef = firebase.storage().ref();
    var currentIndex = house_counter;

    storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
        createHouseImage(url, currentIndex)
    }).catch(function (error) {

    });

    volunteer_row.appendChild(house_cell[house_counter]);
    house_counter++;
}

// creates the house image element and appends it to the house cell with the correct id
function createHouseImage(url, index){
    house_image = document.createElement('img');
    house_image.className = 'house_image';
    house_image.src = url;
    document.getElementById(index).appendChild(house_image);
}

// initializes the volunteer_listing element
function setVolunteerInfo() {
    volunteer_listing.setAttribute("class", "volunteer_info");
    volunteer_listing.onclick = function () {
        // - go to volunteers profile
    };
}


//resets search criteria form
function reset_form() {
    document.getElementById("city").value = '';
    document.getElementById("pets").value = '';
    document.getElementById("family").value = '';
    document.getElementById("first_name").value = '';
    document.getElementById("last_name").value = '';
    document.getElementById("address").value = '';
    displayVolunteers();
}