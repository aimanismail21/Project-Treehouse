// takes all database profile data to display on profile page
var uid = null;
var name = null;
var user = firebase.auth().currentUser;

if (user != null) {
    name = user.displayName;
    uid = user.uid;
}

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
    let dbref = firebase.database().ref("Volunteers/"+"Uid2");
    dbref.set({
        FirstName: first_name,
        LastName: last_name,
        Address: address,
        HouseHoldMembers: family,
        Pets: pets,
        PhoneNumber: phone_number,
        TypeOfRoom: room_type,
        City: city
    });
}
