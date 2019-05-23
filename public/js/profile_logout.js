var main_app = {};

// Allows user to logout, redirected to sign-in page
(function(){
    var firebase = app_fireBase;
    var uid = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        }else{
            // Redirect to login page.
            uid = null;
            window.location.replace("signup_and_login.html");
        }
    });
    // Calls sign out method
    function log_out(){
        firebase.auth().signOut();
    }
    main_app.log_out = log_out;
})();



