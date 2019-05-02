
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

                // create new volunteer listing element
                let volunteer_listing = document.createElement("div");
                volunteer_listing.setAttribute("class", "volunteer_info");
                volunteer_listing.style.border = '2px solid black';
                volunteer_listing.innerHTML = first_name +'<br>'+ last_name +'<br>' + city + '<br>' + address + '<br>' +
                    phone_number + '<br>' + household_members + '<br>' + 'pets: ' + pets + '<br>' +
                    type_of_room + '<br>' + availability + '<br>' + email + '<br>';
                volunteer_listing.onclick = function() {
                    // - go to volunteers profile
                };
                // append volunteer listing to volunteers list
                document.getElementById('volunteers').appendChild(volunteer_listing);
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

                //takes input that was entered into criteria form
                let radios = document.getElementsByName('city');
                for (let i = 0, length = radios.length; i < length; i++)
                {
                    if (radios[i].checked)
                    {
                        var city_selection = radios[i].value;
                        break;
                    }
                }

                radios = document.getElementsByName('pets');
                for (let i = 0, length = radios.length; i < length; i++)
                {
                    if (radios[i].checked)
                    {
                        var pets_selection = radios[i].value;
                        break;
                    }
                }

                radios = document.getElementsByName('family');
                for (let i = 0, length = radios.length; i < length; i++)
                {
                    if (radios[i].checked)
                    {
                        var family_selection = radios[i].value;
                        break;
                    }
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

                // display volunteers that fit criteria
                if(city == city_selection && pets == pets_selection && household_members == family_selection) {
                    // create new volunteer listing element
                    let volunteer_listing = document.createElement("div");
                    volunteer_listing.setAttribute("class", "volunteer_info");
                    volunteer_listing.style.border = '2px solid black';
                    volunteer_listing.innerHTML = first_name + '<br>' + last_name + '<br>' + city + '<br>' + address + '<br>' +
                        phone_number + '<br>' + household_members + '<br>' + 'pets: ' + pets + '<br>' +
                        type_of_room + '<br>' + availability + '<br>' + email;
                    volunteer_listing.onclick = function () {
                        // - go to volunteers profile
                    };
                    // append volunteer listing to volunteers list
                    document.getElementById('volunteers').appendChild(volunteer_listing)
                }
            });

        });

}


// function to sort volunteer list to only show ones with entered address
function update_by_address() {
    let address = document.getElementById("volunteers").elements[0].value;
}
