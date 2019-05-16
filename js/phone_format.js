
// formats number while entering it to add dashes
function format_number(ele, key) {
    let number = ele.value;
    let new_number = number;

    // if 3 numbers entered adds a dash
    if (number.length === 3) {
        new_number = number + '-';
    }

    // if 6 numbers entered adds a dash
    if (number.length === 7) {
        new_number = number + '-';
    }

    // if only 3 numbers and a dash when deleting deletes 3rd digit
    if (number.length === 3 && key.keyCode === 8){
        new_number = number.substring(0, 2)
    }

    // if 6 numbers and dash at the end when deleting deletes 6th digit
    if (number.length === 7 && key.keyCode === 8){
        new_number = number.substring(0, 6)
    }

    // doesnt allow entering of over 10 digits
    if (number.length >= 13 && key.keyCode !== 8) {
        new_number = number.substring(0, 12);
    }

    // sets value of element to new formatted number
    ele.value = new_number;
}


document.getElementById('phone').onkeyup = function(e) {
    format_number(this, e);
};