
// displays all volunteers to screen
function displayVolunteers(){
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
                let pets = snap.child("pets").val();
                let type_of_room = snap.child("TypeOfRoom").val();
                let availability = snap.child("Availability").val();

                // create new volunteer listing element
                let volunteer_listing = document.createElement("div");
                volunteer_listing.setAttribute("class", "volunteer_info");
                volunteer_listing.style.border = '2px solid black';
                volunteer_listing.innerHTML = first_name +'<br>'+ last_name +'<br>' + city + '<br>' + address + '<br>' +
                    phone_number + '<br>' + household_members + '<br>' + 'pets: ' + pets + '<br>' +
                    type_of_room + '<br>' + availability + '<br>' + email;
                volunteer_listing.onclick = function() {
                    // - go to volunteers profile
                };
                // append volunteer listing to volunteers list
                document.getElementById('volunteers_list').appendChild(volunteer_listing)
            });

        });
}

displayVolunteers();