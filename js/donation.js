let amount = 10;
let default_amount = document.getElementById("amount");
let currencies = document.getElementById("currency");
let selected_currency = "CAD";
function getAmount(objButton){
    amount = objButton.value;
}

// Update page after clicking "Donate"
$('#nextPage').on('click', function(){
    $('#donation_amount').hide();
    $('#title').html("Payment");
    let link = document.createElement("li");
    let olds = document.getElementsByClassName("breadcrumb-item");
    let page_url = window.location.pathname;
    olds[1].innerHTML = "<a href='"+ page_url +"'>Donation</a>";
    link.className = "breadcrumb-item active";
    link.innerHTML = "Payment";
    let bread = $('.breadcrumb');
    bread[0].appendChild(link);
    default_amount.value = amount;
    default_amount.placeholder = amount;
    $('#payment').show();
    setTimeout(function(){start_stripe();},100);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            let username = user.displayName;
            let url_logged_in = './receipt_logged_in.html?amount='+amount+'&selected_currency='+selected_currency+'&name='+username;
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

// Update donation amount according to currency
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

    /**
     * Copyright 2016 Google Inc. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    'use strict';

    const functions = require('firebase-functions');
    const admin = require('firebase-admin');
    admin.initializeApp();
    const logging = require('@google-cloud/logging')();
    const stripe = require('stripe')(functions.config().stripe.token);
    const currency = functions.config().stripe.currency || selected_currency;

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
    exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate(async (snap, context) => {
        const val = snap.data();
        try {
            // Look up the Stripe customer id written in createStripeCustomer
            const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get()
            const snapval = snapshot.data();
            const customer = snapval.customer_id;
            // Create a charge using the pushId as the idempotency key
            // protecting against double charges
            const amount = val.amount;
            const idempotencyKey = context.params.id;
            const charge = {amount, currency, customer};
            if (val.source !== null) {
                charge.source = val.source;
            }
            const response = await stripe.charges.create(charge, {idempotency_key: idempotencyKey});
            // If the result is successful, write it back to the database
            return snap.ref.set(response, { merge: true });
        } catch(error) {
            // We want to capture errors and render them in a user-friendly way, while
            // still logging an exception with StackDriver
            console.log(error);
            await snap.ref.set({error: userFacingMessage(error)}, { merge: true });
            return reportError(error, {user: context.params.userId});
        }
    });
// [END chargecustomer]]

// When a user is created, register them with Stripe
    exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
        const customer = await stripe.customers.create({email: user.email});
        return admin.firestore().collection('stripe_customers').doc(user.uid).set({customer_id: customer.id});
    });

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
    exports.addPaymentSource = functions.firestore.document('/stripe_customers/{userId}/tokens/{pushId}').onCreate(async (snap, context) => {
        const source = snap.data();
        const token = source.token;
        if (source === null){
            return null;
        }

        try {
            const snapshot = await admin.firestore().collection('stripe_customers').doc(context.params.userId).get();
            const customer =  snapshot.data().customer_id;
            const response = await stripe.customers.createSource(customer, {source: token});
            return admin.firestore().collection('stripe_customers').doc(context.params.userId).collection("sources").doc(response.fingerprint).set(response, {merge: true});
        } catch (error) {
            await snap.ref.set({'error':userFacingMessage(error)},{merge:true});
            return reportError(error, {user: context.params.userId});
        }
    });

// When a user deletes their account, clean up after them
    exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
        const snapshot = await admin.firestore().collection('stripe_customers').doc(user.uid).get();
        const customer = snapshot.data();
        await stripe.customers.del(customer.customer_id);
        return admin.firestore().collection('stripe_customers').doc(user.uid).delete();
    });

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
    function reportError(err, context = {}) {
        // This is the name of the StackDriver log stream that will receive the log
        // entry. This name can be any valid log stream name, but must contain "err"
        // in order for the error to be picked up by StackDriver Error Reporting.
        const logName = 'errors';
        const log = logging.log(logName);

        // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
        const metadata = {
            resource: {
                type: 'cloud_function',
                labels: {function_name: process.env.FUNCTION_NAME},
            },
        };

        // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
        const errorEvent = {
            message: err.stack,
            serviceContext: {
                service: process.env.FUNCTION_NAME,
                resourceType: 'cloud_function',
            },
            context: context,
        };

        // Write the error log entry
        return new Promise((resolve, reject) => {
            log.write(log.entry(metadata, errorEvent), (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        });
    }
// [END reporterror]

// Sanitize the error message for the user
    function userFacingMessage(error) {
        return error.type ? error.message : 'An error occurred, developers have been alerted';
    }
}