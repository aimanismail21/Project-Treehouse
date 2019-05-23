TestCase("validate_inputs Test", {
    "test incorrect first name returns false": function () {
        first_name = '123';
        last_name = 'may';
        phone_number = '123-123-1234';
        assertEquals(false, validate_inputs());
    },
    "test incorrect last name returns false": function () {
        first_name = 'tommy';
        last_name = '123';
        phone_number = '123-123-1234';
        assertEquals(false, validate_inputs());
    },
    "test incorrect phone number returns false": function () {
        first_name = 'tommy';
        last_name = 'may';
        phone_number = '1jg39j94f';
        assertEquals(false, validate_inputs());
    },
    "test correct inputs returns true": function () {
        first_name = 'tommy';
        last_name = 'may';
        phone_number = '123-123-1234';
        assertEquals(true, validate_inputs());
    },
});