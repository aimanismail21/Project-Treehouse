let amount = 10;
let currencies = document.getElementById("currency");
let selected_currency = "CAD";

// Retrieves a button's value and assigns it to the variable, amount
function get_amount(objButton){
    amount = objButton.value;
}

// Place amount into input element
function place_amount(element){
    element.value = amount;
    element.placeholder = amount;
}

// Hides the donation amount selection UI
function hide_donation_selection(){
    $('#donation_amount').hide();
}

// Rename the title of page
function rename_page_title(title){
    $('#title').html(title);
}

// Update old breadcrumbs
function update_breadcrumbs(page_url){
    let original_links = document.getElementsByClassName("breadcrumb-item");
    original_links[1].innerHTML = "<a href='"+ page_url +"'>Donation</a>";
}

// Add new breadcrumb
function add_breadcrumb(){
    let new_link = document.createElement("li");
    new_link.className = "breadcrumb-item active";
    new_link.innerHTML = "Payment";
    let bread = $('.breadcrumb');
    bread[0].appendChild(new_link);
}

// Show Payment API page
function show_api(){
    $('#payment').show();
}


// Update page after clicking "Donate"
$('#nextPage').on('click', function(){
    let page_url = window.location.pathname;
    hide_donation_selection();
    let default_amount = document.getElementById("amount");
    place_amount(default_amount);
    rename_page_title("Payment");
    update_breadcrumbs(page_url);
    add_breadcrumb();
    setTimeout(function(){start_stripe();},100);
    show_api();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            let username = user.displayName;
            let url_logged_in = './dashboard_receipt.html?amount='+amount+'&selected_currency='+selected_currency+'&name='+username;
            let url = './receipt.html?amount='+amount+'&selected_currency='+selected_currency+'&name='+username;
            let test_url = page_url.slice(-14,);
            if (test_url === "/donation.html"){
                document.getElementById('charge').setAttribute("href", url);
            } else {document.getElementById('charge_logged_in').setAttribute("href", url_logged_in);}
        } else {
            // No user is signed in.
        }
    });
});

// Function to dynamically add currency selections with exchange rates
function add_currencies(data) {
    let ratesObj = data.rates;
    for (let key in ratesObj) {
        let option = document.createElement("option");
        option.value = ratesObj[key];
        option.innerHTML = key;
        option.label = key;
        if (key === "CAD") {
            option.selected = true;
        }
        currencies.appendChild(option);
    }
}

// Access Exchange Rate API and apply the add_currencies function
$.getJSON('https://api.exchangeratesapi.io/latest?base=CAD', function(data) {
    add_currencies(data);
});

// Event listener to update donation amount according to currency
currencies.addEventListener('change', function(){
    for(let i = 0; i < 6; i++){
        let amounts = [5, 10, 15, 25, 50, 100];
        $('.bg-light')[i].value = Math.round(amounts[i]*this.value);
    }
    let options = this.children;
    for(let i in options){
        if(options[i].selected){
            selected_currency = options[i].label;
        }
    }
    document.getElementById("symbol").innerText = getSymbolFromCurrency(selected_currency);
    amount = Math.round(10*this.value);
}, false);

// Code below is from Stripe/Firebase (https://github.com/firebase/functions-samples/tree/master/stripe)
function start_stripe() {
    Stripe.setPublishableKey("pk_test_T8PiFwZj8C2M3x0SzvZ8ohVe00mE6oIvRZ");
    var firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
    var firebaseAuthOptions = {
        callbacks: {
            signInSuccess: (currentUser, credential, redirectUrl) => {
                return false;
            },
            uiShown: () => {
                document.getElementById('loader').style.display = 'none';
            }
        },
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        tosUrl: '/'
    };
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            app.currentUser = firebaseUser;
            app.listen();
        } else {
            firebaseUI.start('#firebaseui-auth-container', firebaseAuthOptions);
            app.currentUser = null;
        }
    });

    var app = new Vue({
        el: '#app',
        data: {
            currentUser: null,
            sources: {},
            stripeCustomerInitialized: false,
            newCreditCard: {
                number: '',
                cvc: '',
                exp_month: null,
                exp_year: null,
                address_zip: ''
            },
            charges: {},
            newCharge: {
                source: null,
                amount: amount
            }
        },
        ready: () => {
        },
        methods: {
            listen: function () {
                firebase.firestore().collection('stripe_customers').doc(`${this.currentUser.uid}`).onSnapshot(snapshot => {
                    this.stripeCustomerInitialized = (snapshot.data() !== null);
                }, () => {
                    this.stripeCustomerInitialized = false;
                });
                firebase.firestore().collection('stripe_customers').doc(`${this.currentUser.uid}`).collection('sources').onSnapshot(snapshot => {
                    let newSources = {};
                    snapshot.forEach(doc => {
                        const id = doc.id;
                        newSources[id] = doc.data();
                    });
                    this.sources = newSources;
                }, () => {
                    this.sources = {};
                });
                firebase.firestore().collection('stripe_customers').doc(`${this.currentUser.uid}`).collection('charges').onSnapshot(snapshot => {
                    let newCharges = {};
                    snapshot.forEach(doc => {
                        const id = doc.id;
                        newCharges[id] = doc.data();
                    });
                    this.charges = newCharges;
                }, () => {
                    this.charges = {};
                });
            },
            submitNewCreditCard: function () {
                Stripe.card.createToken({
                    number: this.newCreditCard.number,
                    cvc: this.newCreditCard.cvc,
                    exp_month: this.newCreditCard.exp_month,
                    exp_year: this.newCreditCard.exp_year,
                    address_zip: this.newCreditCard.address_zip
                }, (status, response) => {
                    if (response.error) {
                        this.newCreditCard.error = response.error.message;
                    } else {
                        firebase.firestore().collection('stripe_customers').doc(this.currentUser.uid).collection('tokens').add({token: response.id}).then(() => {
                            this.newCreditCard = {
                                number: '',
                                cvc: '',
                                exp_month: 1,
                                exp_year: 2017,
                                address_zip: ''
                            };
                        });
                    }
                });
            },
            submitNewCharge: function () {
                firebase.firestore().collection('stripe_customers').doc(this.currentUser.uid).collection('charges').add({
                    source: this.newCharge.source,
                    amount: parseInt(this.newCharge.amount)
                });
            },
            signOut: function () {
                firebase.auth().signOut()
            }
        }
    });
}
