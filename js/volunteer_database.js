
// displays all volunteers to screen
function displayVolunteers(){
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Volunteers/");
    ref.on(
        "value",
        function(snap){
            snap.forEach(function(snap){
                // obtains info for each volunteer from database
                let first_name = snap.child("FirstName").val();
                let last_name = snap.child("LastName").val();
                let city = snap.child("City").val();
                let address = snap.child("Address").val();
                let phone_number = snap.child("PhoneNumber").val();
                let email = snap.child("Email").val();
                let household_members = snap.child("HouseHoldMembers").val();
                let pets = snap.child("Pets").val();
                let type_of_room = snap.child("TypeOfRoom").val();
                let availability = snap.child("Availability").val();
                let user_id = snap.key;

                // only display info if availability is set to open
                if(availability === 'Open') {
                    // create new volunteer listing element
                    let volunteer_listing = document.createElement("div");
                    // retrieve image of house from database and display with volunteer info
                    var storageRef = firebase.storage().ref();
                    storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
                        var house_image = document.createElement('img');
                        house_image.src = url;
                        house_image.style = 'width: 216px; height: 216px; position: relative; top: -216px; left: 0px;';
                        volunteer_listing.appendChild(house_image);

                    }).catch(function (error) {

                    });

                    // set volunteer_listing
                    volunteer_listing.setAttribute("class", "volunteer_info");
                    volunteer_listing.style = 'height: 220px; overflow-y: hidden';
                    volunteer_listing.style.border = '2px solid black';
                    volunteer_listing.onclick = function () {
                        // - go to volunteers profile
                    };

                    // set volunteer_listing info
                    var volunteer_info = document.createElement('div');
                    volunteer_info.style = 'position: relative; left: 220px;width: 250px; font-size: 1em';
                    volunteer_info.innerHTML ='<b>First Name: ' + first_name + '<br>Last Name:' + last_name +
                        '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number:' +
                        phone_number + '<br>Family Members:' + household_members + '<br>Pets:' + pets + '<br>RoomType: ' +
                        type_of_room + '<br>Email: ' + email;
                    // append volunteer info to volunteer listing
                    volunteer_listing.appendChild(volunteer_info);

                    // append volunteer listing to volunteers list
                    let linebreak = document.createElement('br');
                    document.getElementById('volunteers').appendChild(volunteer_listing);
                    document.getElementById('volunteers').appendChild(linebreak)

                }
            });

        });
}


// reveal dropdown contents when pressed
function dropdown(id){
    document.getElementById(id).classList.toggle("show");

}


// function to sort volunteer list to only show ones with entered criterion
function update_by_criteria() {
    // clears the volunteers list
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Volunteers/");
    ref.on(
        "value",
        function(snap){

            snap.forEach(function(snap){
                let city_selection = null;
                let pets_selection = null;
                let family_selection = null;

                // initialize city to value in database if nothing is selected
                if(document.getElementById('city').value === '') {
                    city_selection = snap.child("City").val();
                }
                // if a city is selected take its value
                else{
                    city_selection = document.getElementById('city').value
                }

                // initialize pets to value in database if nothing is selected
                if(document.getElementById('pets').value === '') {
                    pets_selection = snap.child("Pets").val();
                }
                // if pets is selected take its value
                else{
                    pets_selection = document.getElementById('pets').value
                }

                // initialize family to value in database if nothing is selected
                if(document.getElementById('family').value === '') {
                    family_selection = snap.child("HouseHoldMembers").val();
                }
                // if family is selected take its value
                else{
                    family_selection = document.getElementById('family').value
                }

                // obtains info for each volunteer from database
                let first_name = snap.child("FirstName").val();
                let last_name = snap.child("LastName").val();
                let city = snap.child("City").val();
                let address = snap.child("Address").val();
                let phone_number = snap.child("PhoneNumber").val();
                let email = snap.child("Email").val();
                let household_members = snap.child("HouseHoldMembers").val();
                let pets = snap.child("Pets").val();
                let type_of_room = snap.child("TypeOfRoom").val();
                let availability = snap.child("Availability").val();
                let user_id = snap.key;

                // display volunteers that fit criteria
                if(city == city_selection && pets == pets_selection
                    && household_members == family_selection && availability == "Open") {
                    // create new volunteer listing element
                    let volunteer_listing = document.createElement("div");
                    // retrieve image of house from database and display with volunteer info
                    var storageRef = firebase.storage().ref();
                    storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
                        var house_image = document.createElement('img');
                        house_image.src = url;
                        house_image.style = 'width: 196px; position: relative; top: -179px; left: 0px;';
                        volunteer_listing.appendChild(house_image);

                    }).catch(function (error) {

                    });

                    // set volunteer_listing
                    volunteer_listing.setAttribute("class", "volunteer_info");
                    volunteer_listing.style = 'height: 200px;';
                    volunteer_listing.style.border = '2px solid black';
                    volunteer_listing.onclick = function () {
                        // - go to volunteers profile
                    };

                    // set volunteer_listing info
                    var volunteer_info = document.createElement('div');
                    volunteer_info.style = 'position: relative; left: 220px;width: 200px';
                    volunteer_info.innerHTML ='<b>First Name: ' + first_name + '<br>Last Name:' + last_name +
                        '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number:' +
                        phone_number + '<br>Family Members:' + household_members + '<br>Pets:' + pets + '<br>RoomType: ' +
                        type_of_room + '<br>Email: ' + email + '</b>';
                    // append volunteer info to volunteer listing
                    volunteer_listing.appendChild(volunteer_info);

                    // append volunteer listing to volunteers list
                    let linebreak = document.createElement('br');
                    document.getElementById('volunteers').appendChild(volunteer_listing);
                    document.getElementById('volunteers').appendChild(linebreak)

                }
            });

        });

}


// function to sort volunteer list to only show ones with entered address
function update_by_address() {
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Volunteers/");
    ref.on(
        "value",
        function(snap){
            snap.forEach(function(snap){
                // get address entered to search for
                let address_entered = document.getElementById("address").value;

                // only write volunteer with entered address
                if(address_entered === snap.child("Address").val()) {
                    // obtains info for each volunteer from database
                    let first_name = snap.child("FirstName").val();
                    let last_name = snap.child("LastName").val();
                    let city = snap.child("City").val();
                    let address = snap.child("Address").val();
                    let phone_number = snap.child("PhoneNumber").val();
                    let email = snap.child("Email").val();
                    let household_members = snap.child("HouseHoldMembers").val();
                    let pets = snap.child("Pets").val();
                    let type_of_room = snap.child("TypeOfRoom").val();
                    let availability = snap.child("Availability").val();
                    let user_id = snap.key;

                    // only display info if availability is set to open
                    if(availability === 'Open') {
                        // create new volunteer listing element
                        let volunteer_listing = document.createElement("div");
                        // retrieve image of house from database and display with volunteer info
                        var storageRef = firebase.storage().ref();
                        storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
                            var house_image = document.createElement('img');
                            house_image.src = url;
                            house_image.style = 'width: 196px; position: relative; top: -179px; left: 0px;';
                            volunteer_listing.appendChild(house_image);

                        }).catch(function (error) {

                        });

                        // set volunteer_listing
                        volunteer_listing.setAttribute("class", "volunteer_info");
                        volunteer_listing.style = 'height: 200px;';
                        volunteer_listing.style.border = '2px solid black';
                        volunteer_listing.onclick = function () {
                            // - go to volunteers profile
                        };

                        // set volunteer_listing info
                        var volunteer_info = document.createElement('div');
                        volunteer_info.style = 'position: relative; left: 220px;width: 200px';
                        volunteer_info.innerHTML = '<b>First Name: ' + first_name + '<br>Last Name:' + last_name +
                            '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number:' +
                            phone_number + '<br>Family Members:' + household_members + '<br>Pets:' + pets + '<br>RoomType: ' +
                            type_of_room + '<br>Email: ' + email + '</b>';
                        // append volunteer info to volunteer listing
                        volunteer_listing.appendChild(volunteer_info);

                        // append volunteer listing to volunteers list
                        let linebreak = document.createElement('br');
                        document.getElementById('volunteers').appendChild(volunteer_listing);
                        document.getElementById('volunteers').appendChild(linebreak)
                    }
                }
            });

        });
}

function update_by_name(){
    document.getElementById('volunteers').innerHTML = "";
    let ref = firebase.database().ref("Volunteers/");
    ref.on(
        "value",
        function(snap){
            snap.forEach(function(snap){
                // get address entered to search for
                let first_name_entered = document.getElementById("first_name").value;
                let last_name_entered = document.getElementById("last_name").value;

                // only write volunteer with entered address
                if(first_name_entered === snap.child("FirstName").val() ||
                    last_name_entered === snap.child("LastName").val()) {
                    // obtains info for each volunteer from database
                    let first_name = snap.child("FirstName").val();
                    let last_name = snap.child("LastName").val();
                    let city = snap.child("City").val();
                    let address = snap.child("Address").val();
                    let phone_number = snap.child("PhoneNumber").val();
                    let email = snap.child("Email").val();
                    let household_members = snap.child("HouseHoldMembers").val();
                    let pets = snap.child("Pets").val();
                    let type_of_room = snap.child("TypeOfRoom").val();
                    let availability = snap.child("Availability").val();
                    let user_id = snap.key;

                    // only display info if availability is set to open
                    if(availability === 'Open') {
                        // create new volunteer listing element
                        let volunteer_listing = document.createElement("div");
                        // retrieve image of house from database and display with volunteer info
                        var storageRef = firebase.storage().ref();
                        storageRef.child(user_id + '/house_image').getDownloadURL().then(function (url) {
                            var house_image = document.createElement('img');
                            house_image.src = url;
                            house_image.style = 'width: 196px; position: relative; top: -179px; left: 0px;';
                            volunteer_listing.appendChild(house_image);

                        }).catch(function (error) {

                        });

                        // set volunteer_listing
                        volunteer_listing.setAttribute("class", "volunteer_info");
                        volunteer_listing.style = 'height: 200px;';
                        volunteer_listing.style.border = '2px solid black';
                        volunteer_listing.onclick = function () {
                            // - go to volunteers profile
                        };

                        // set volunteer_listing info
                        var volunteer_info = document.createElement('div');
                        volunteer_info.style = 'position: relative; left: 220px;width: 200px';
                        volunteer_info.innerHTML = '<b>First Name: ' + first_name + '<br>Last Name:' + last_name +
                            '<br>City: ' + city + '<br>Address: ' + address + '<br>Phone Number:' +
                            phone_number + '<br>Family Members:' + household_members + '<br>Pets:' + pets + '<br>RoomType: ' +
                            type_of_room + '<br>Email: ' + email + '</b>';
                        // append volunteer info to volunteer listing
                        volunteer_listing.appendChild(volunteer_info);

                        // append volunteer listing to volunteers list
                        let linebreak = document.createElement('br');
                        document.getElementById('volunteers').appendChild(volunteer_listing);
                        document.getElementById('volunteers').appendChild(linebreak)
                    }
                }
            });

        });

}