let amount = 10;
let default_amount = document.getElementById("amount");
let currencies = document.getElementById("currency");
let selected_currency = "CAD";
default_amount.value = amount;
function getAmount(objButton){
    amount = objButton.value;
    console.log(amount);
}
// Update page after clicking "Donate"
$('#nextPage').on('click', function(){
    $('#donation_amount').hide();
    $('#title').html("Payment");
    let link = document.createElement("li");
    let olds = document.getElementsByClassName("breadcrumb-item");
    olds[1].innerHTML = "<a href='./donation.html'>Donations</a>";
    link.className = "breadcrumb-item active";
    link.innerHTML = "Payment";
    let bread = $('.breadcrumb');
    bread[0].appendChild(link);
    default_amount.value = amount;
    default_amount.placeholder = amount;
    $('#payment').show();
    console.log(amount);
});

// Dynamically add currency selections with their exchange rates compared to CAD
$.getJSON('https://api.exchangeratesapi.io/latest?base=CAD', function(data) {
    let ratesObj = data.rates;
    console.log(ratesObj);
    for(let key in ratesObj){
        let option = document.createElement("option");
        option.value = ratesObj[key];
        option.innerHTML = key;
        option.label = key;
        if(key === "CAD"){
            option.selected = true;
        }
        currencies.appendChild(option);
    }
});
// Update donation amount according to currency
currencies.addEventListener('change', function(){
    for(let i = 0; i < 6; i++){
        let amounts = [5, 10, 15, 25, 50, 100];
        $('.bg-light')[i].value = Math.round(amounts[i]*this.value);
        console.log($('.bg-light')[i].value);
    }
    let options = this.children;
    for(let i in options){
        if(options[i].selected){
            selected_currency = options[i].label;
            console.log(selected_currency);
        }
    }
    amount = Math.round(10*this.value);
    console.log(this.value);
}, false);

Stripe.setPublishableKey("pk_test_T8PiFwZj8C2M3x0SzvZ8ohVe00mE6oIvRZ");
var firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
var firebaseAuthOptions = {
    callbacks: {
        signInSuccess: (currentUser, credential, redirectUrl) => { return false; },
        uiShown: () => { document.getElementById('loader').style.display = 'none'; }
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ],
    tosUrl: '/'
};
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        document.getElementById('loader').style.display = 'none';
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
            number: '4242424242424242',
            cvc: '111',
            exp_month: 1,
            exp_year: 2020,
            address_zip: '00000'
        },
        charges: {},
        newCharge: {
            source: null,
            amount: 2000
        }
    },
    ready: () => {
    },
    methods: {
        listen: function() {
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
                })
                this.sources = newSources;
            }, () => {
                this.sources = {};
            });
            firebase.firestore().collection('stripe_customers').doc(`${this.currentUser.uid}`).collection('charges').onSnapshot(snapshot => {
                let newCharges = {};
                snapshot.forEach(doc => {
                    const id = doc.id;
                    newCharges[id] = doc.data();
                })
                this.charges = newCharges;
            }, () => {
                this.charges = {};
            });
        },
        submitNewCreditCard: function() {
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
        submitNewCharge: function() {
            firebase.firestore().collection('stripe_customers').doc(this.currentUser.uid).collection('charges').add({
                source: this.newCharge.source,
                amount: amount
            });
        },
        signOut: function() {
            firebase.auth().signOut()
        }
    }
});
// Save the value of selected button
// Event Listener for button click
