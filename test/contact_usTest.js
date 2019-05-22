TestCase("validate_email testTest", {

    "empty field": function(){
        assertEquals(false, validate_email(""));
    },

    "test no domain": function(){
        assertEquals(false, validate_email("example"));
    },

    "test correct field": function(){
        assertEquals(true, validate_email("example@example.ca"));
    },

    "test no @": function(){
        assertEquals(false, validate_email("example.example.ca"));
    },

    "test correct with capitals and symbols": function(){
        assertEquals(true, validate_email("ExAmPle-T_e.s.t@example.ca"));
    },

    "test email with space": function(){
        assertEquals(false, validate_email("e x a m p l e@example.ca"));
    },

    "test no name": function(){
        assertEquals(false, validate_email("@example.ca"));
    },

    "test just a space": function(){
        assertEquals(false, validate_email(" "));
    },

    "test just a letter": function(){
        assertEquals(false, validate_email("a"));
    },

    "test just a number": function(){
        assertEquals(false, validate_email("1"));
    },

    "test just a symbol": function(){
        assertEquals(false, validate_email("@"));
    },

    "test just another symbol": function(){
        assertEquals(false, validate_email("-"));
    },

    "test random numbers and letters": function(){
        assertEquals(false, validate_email("4354655"));
    },
});