var valueName, valueSurname, valueAge, valuePassword, valueRole, valueConfirmPasssword;
var urlPage = "http://localhost:8082/user/";
var headerId, headerRole;

$(document).ready(function() {

    $('#buttonNew').hide();
    $('#buttonShow').hide();
    $("#Exit").hide();

    $('#modal_close, #overlay, #ADD, #Cancel,#UPDATE, #buttonLoginIn').click(function() {
        $('#modal_formTwo, #modal_formThree, #modal_formFour, #modal_formFive')
            .animate({
                    opacity: 0,
                    top: '45%'
                }, 200,
                function() {
                    $(this).css('display', 'none');
                    $('#overlay').fadeOut(400);
                }
            );
    });

    $("#loginIn").click(function(event) {

        event.preventDefault();
        $('#overlay').fadeIn(400,
            function() {
                $('#modal_formFour')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            });

    });
    $("#signUp").click(function(event) {

        modelWindow();

    });
    $("#buttonLoginIn").click(function(event) {
        $("#loginIn").hide();
        $("#signUp").hide();
        $("#Exit").show();
        postLoginPersonToServer();

    });

    $("#buttonSignUp").click(function(event) {

        postPersonsToServer();

    });
    $("#Exit").click(function(event) {
        $('#loginIn').show();
        $("#signUp").show();
        $("#Exit").hide();
        $("#buttonNew").hide();
        $("#buttonShow").hide();
        $("table").hide();

    });

    function postLoginPersonToServer() {

        var valueLoginName = $('#loginUserName').val();
        var valueLoginPassword = $('#passwordLogiIn').val();

        $.ajax({
            url: "http://localhost:8082/loginuser",
            type: "POST",
            data: {
                name: valueLoginName,
                password: valueLoginPassword
            },
            success: function(result) {

                console.log(result);
                headerId = result.id;
                headerRole = result.role;
                $("#buttonNew").show();
                $("#buttonShow").show();
                showButtonForPerson();

            },
            error: function(result) {

                alert("Wrong name or surname or age");
                console.log('Something went wrong');
            }
        });
    }


    function showButtonForPerson() {

        $('#buttonNew').click(function(event) {
            modelWindow();
        });
        $('#buttonShow').click(function(event) {

            getPersonsByServer();

        });
    }

    function modelWindow() {

        $(this).hide();
        event.preventDefault();
        $('#overlay').fadeIn(400,
            function() {
                $('#modal_formFive')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            });
    }

    function postPersonsToServer() {

        valueName = $("#signUpName").val();
        valueSurname = $("#signUpSurname").val();
        valueAge = $("#signUpAge").val();
        valuePassword = $("#signUpPassword").val();
        valueConfirmPasssword = $("#signUpConfirmPassword").val();
        valueRole = $("#selectRole option:selected").text();

        if (valuePassword === valueConfirmPasssword) {
            $.ajax({
                url: "http://localhost:8082/user",
                headers: {
                    'header-id': headerId,
                    'header-role': headerRole
                },
                type: "POST",
                data: {
                    name: valueName,
                    surname: valueSurname,
                    age: valueAge,
                    password: valuePassword,
                    role: valueRole
                },
                success: function() {

                    alert("Add person success");
                    console.log('Successfully connected to the server');

                },
                error: function() {

                    alert("Wrong name or surname or age");
                    console.log('Something went wrong');
                }
            });
            $('#modal_formFive')
                .animate({
                        opacity: 0,
                        top: '45%'
                    }, 200,
                    function() {
                        $(this).css('display', 'none');
                        $('#overlay').fadeOut(400);
                    }
                );
        } else {
            $("#areaForError").text("Passwords do not match");
        }
    }

    function getPersonsByServer() {

        $.ajax({
            url: "http://localhost:8082/users",
            headers: {
                'header-id': headerId,
                'header-role': headerRole
            },
            type: "GET",
            success: function(data) {
                //data = Object.values(data);
                // data = Array.from(data);
                console.log(data);


                var tableForPersons = document.createElement('div');
                if (document.getElementById('userstable')) {
                    var elem = document.getElementById('userstable');
                    elem.parentNode.removeChild(elem);
                }
                tableForPersons.setAttribute('id', 'userstable');
                var table = document.createElement('table');
                $.each(data, function(index, value) {
                    if (value !== null) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + value.name + '</td>' +
                            '<button class="EditByPerson">Edit</button>' +
                            '<button class="info">Info</button>' +
                            '<button class="del">Delete</button>';
                        tr.setAttribute('id', value.id);
                        table.appendChild(tr);
                    }


                });

                tableForPersons.appendChild(table);
                document.body.appendChild(tableForPersons);

                tableForPersons.onclick = function(event) {

                    var target = event.target;
                    var targetId = +target.parentNode.getAttribute('id');


                    if (target.className == 'del') {

                        deletePersonByServer(targetId);
                    }
                    if (target.className == 'info') {
                        getInfoPersonbyServer(targetId);
                    }
                    if (target.className == 'EditByPerson') {
                        $('#buttonSignUp').unbind();
                        postUpdatePersonToServer(targetId);
                    }
                }

            },
            error: function(data) {

                alert("Wrong name or surname or age");
                console.log('Something went wrong');
            }
        });

    }


    function deletePersonByServer(targetId) {
        $.ajax({
            url: urlPage + targetId,
            headers: {
                'header-id': headerId,
                'header-role': headerRole
            },
            type: 'DELETE',
            success: function(result) {

                alert(result);
                console.log('Successfully connected to the server');
            },
            error: function(result) {

                alert(result.responseText);
                console.log('Error');
            }
        });
    }


    function getInfoPersonbyServer(targetId) {

        event.preventDefault();
        $('#overlay').fadeIn(400,
            function() {
                $('#modal_formTwo')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            });

        $.get(urlPage + targetId, function(data) {

            $("#infoName").text(data.name);
            $("#infoSurname").text(data.surname);
            $("#infoAge").text(data.age);
            $("#infoRole").text(data.role);
        });
    }

    function postUpdatePersonToServer(targetId) {


        $.ajax({
            url: urlPage + targetId,
            headers: {
                'header-id': headerId,
                'header-role': headerRole
            },
            type: "GET",
            success: function(data) {

            	 modelWindow();
                $("#signUpName").val(data.name);
                $("#signUpSurname").val(data.surname);
                $("#signUpAge").val(data.age);

            },
            error: function(data) {

                alert(data.responseText);
                console.log('Something went wrong');
            }

        });

        $("#buttonSignUp").click(function(event) {

            valueName = $("#signUpName").val();
            valueSurname = $("#signUpSurname").val();
            valueAge = $("#signUpAge").val();
            $.ajax({
                url: urlPage + targetId,
                headers: {
                    'header-id': headerId,
                    'header-role': headerRole
                },
                type: "POST",
                data: {
                    name: valueName,
                    surname: valueSurname,
                    age: valueAge
                },
                success: function(data) {

                    //alert(data);
                    console.log('Successfully connected to the server');

                },
                error: function() {

                    //alert(" Bad update person");
                    console.log('Something went wrong');
                }
            });
        });
    }
});