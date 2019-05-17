TestCase("phone_formatTest", {
    "test 3 digits entered adds dash": function(){
        let ele = document.createElement("input");
        ele.value = '433';
        format_number(ele, 51);
        assertEquals('433-', ele.value);
    },
    "test 6 digits entered adds dash": function(){
        let ele = document.createElement("input");
        ele.value = '433-333';
        format_number(ele, 51);
        assertEquals('433-333-', ele.value);
    },
    "test over 10 digits entered deletes extra characters": function(){
        let ele = document.createElement("input");
        ele.value = '433-333-33333';
        format_number(ele, 51);
        assertEquals('433-333-3333', ele.value);
    },
    "test delete key removes a digit": function(){
        let ele = document.createElement("input");
        ele.value = '433';
        format_number(ele, 8);
        assertEquals('43', ele.value);
    },
});
