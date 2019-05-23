TestCase("get_amountTest", {
    "test getAmount amount is obj value": function(){
        let objButton = document.createElement("input");
        objButton.value = "1";
        get_amount(objButton);
        assertEquals("1", amount);
    }
});


TestCase("place_amountTest", {
    "test place_amount value is amount": function(){
        let some_element = document.createElement("input");
        place_amount(some_element);
        let value = some_element.value;
        assertEquals(amount, value);
    },
    "test place_amount placeholder is amount": function(){
        let some_element = document.createElement("input");
        place_amount(some_element);
        let placeholder = some_element.placeholder;
        assertEquals(amount, placeholder);
    }
});