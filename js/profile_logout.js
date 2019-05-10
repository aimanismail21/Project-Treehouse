var mainApp = {};

//Allows user to logout, redirected to sign-in page
(function(){
    var firebase = app_fireBase;
var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        }else{
            // redirect to login page.
            uid = null;
            window.location.replace("signup_volunteer.html");
        }
    });

    function logOut(){
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;
})();