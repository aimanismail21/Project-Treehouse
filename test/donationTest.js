TestCase("getAmount testTest", {
    "test getAmount amount is obj value": function(){
        let objButton = document.createElement("input");
        objButton.value = "1";
        getAmount(objButton);
        assertEquals("1", amount);
    }
});