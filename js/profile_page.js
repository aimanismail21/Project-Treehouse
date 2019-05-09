// takes all database profile data to display on profile page
var uid = null;
var displayName = null;

// initialize variables
let is_social_worker = null;
let is_volunteer = null;

// initialize page elements
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

            // retrieve image of house from database and display with volunteer info
            var storageRef = firebase.storage().ref();
            storageRef.child(uid + '/profile_picture').getDownloadURL().then(function (url) {
                var profile_image = document.getElementById('profile_image');
                profile_image.src = url;

            }).catch(function (error) {

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



// submit profile image to storage
function submit_profile_image() {
    var fileButton = document.getElementById("fileButton");
    var file = fileButton.files[0];
    var new_file = new File([file], 'profile_picture', {
        type: 'image/jpeg',
    });
    var storageRef = firebase.storage().ref(uid + '/' + new_file.name);
    storageRef.put(new_file);
    initApp();
}


// update info of volunteer in database
function update_profile_info() {
    let city = document.getElementById("city").value;
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let address = document.getElementById("address").value;
    let phone_number = document.getElementById("phone_number").value;


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

// resets into to what is currently in the database
function reset_profile_info() {
    initApp();
    document.getElementById('confirmation').innerHTML = 'info has been reset';
}


// initialize page elements with data from database
function initialize_info(snapshot) {
    document.getElementById("first_name").value = snapshot.child('FirstName').val();
    document.getElementById("last_name").value = snapshot.child('LastName').val();
    document.getElementById("city").value = snapshot.child('City').val();
    document.getElementById("address").value = snapshot.child('Address').val();
    document.getElementById("phone_number").value = snapshot.child('PhoneNumber').val();
}


function initialize_elements(snapshot) {
    // get info on user type
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
}

function set_user_type(type) {

    if (type === 'volunteer') {
        is_volunteer = true;
        is_social_worker = false;
    } else if (type === 'social_worker') {
        is_volunteer = false;
        is_social_worker = true;
    }
    
    let dbref = firebase.database().ref("Users/" + uid);
    dbref.update({
        IsSocialWorker: is_social_worker,
        IsVolunteer: is_volunteer
    });
}


(function ($) {
    "use strict"; // Start of use strict

    // Toggle the side navigation
    $("#sidebarToggle").on('click', function (e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });

})(jQuery); // End of use strict

function reset_profile_info(){
  initApp();
  document.getElementById('confirmation').innerHTML = 'info has been reset';
}

