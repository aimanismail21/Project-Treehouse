// takes all database profile data to display on profile page
var uid = null;
var displayName = null;

// initialize page elements
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
            uid = user.uid;
            let dbref = firebase.database().ref("Volunteers/"+uid);
            dbref.on('value', (snapshot) => {
                document.getElementById("first_name").value = snapshot.child('FirstName').val();
                document.getElementById("last_name").value = snapshot.child('LastName').val();
                document.getElementById("city").value = snapshot.child('City').val();
                document.getElementById("pets").value = snapshot.child('Pets').val();
                document.getElementById("family").value = snapshot.child('HouseHoldMembers').val();
                document.getElementById("roomtype").value = snapshot.child('TypeOfRoom').val();
                document.getElementById("address").value = snapshot.child('Address').val();
                document.getElementById("phone_number").value = snapshot.child('PhoneNumber').val();

            });

        } else {

        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});

// update info of volunteer guest room in database
function update_info(){
    let city = document.getElementById("city").value;
    let pets = document.getElementById("pets").value;
    let family = document.getElementById("family").value;
    let room_type = document.getElementById("roomtype").value;
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let address = document.getElementById("address").value;
    let phone_number = document.getElementById("phone_number").value;

    // change Uid2 to uid that is taken from logged in user
    let dbref = firebase.database().ref("Volunteers/"+uid);
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

// resets into to what is currently in the database
function reset_info(){
    initApp();
    document.getElementById('confirmation').innerHTML = 'info has been reset';
}

// sets room availability in database given no or yes
function set_room_availability(availability){
    let dbref = firebase.database().ref("Volunteers/" + uid);
    
    // if availability = yes then availability is set to open in database
    if(availability === 'yes'){
        dbref.update({
            Availability: 'Open'
        });
        document.getElementById('confirmation').innerHTML = 'Room set to Available'
    }
    // if availability = no then availability is set to closed in database
    else if(availability === 'no'){
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