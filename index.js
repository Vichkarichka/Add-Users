var valueName;
var valueSurname;
var valueAge;
var valuePassword;
var valueRole;
var valueConfirmPasssword;
var urlPage = 'http://localhost:8081/user/';
var headerId;
var headerRole;
var headerHash;

const objERROR = {
	USER_LOGIN_ERROR: "Incorrect login or password. Try again",
	USER_CREATE_ERROR: "User with this name exists.",
	USER_INFO_ERROR: "User is not find",
	USER_UPDATE_ERROR: "User can not update",
	USER_RIGTHS_ERROR: "Sorry, you do not have the rights",
	USER_DELETE_ERROR: "User already delete",
	TIMESTAMP_TIMEOUT: "The session is over, please re-login",
	INVALID_TOKEN: "The session is not find,please re-login",
	TOKEN_INSERT_ERROR: "Can not insert session, please re-login",
	TOKEN_UPDATE_ERROR: "Can not refresh session,please re-login",
	CONNECT_ERROR: "Try again",
};

$(document).ready(function() {
    $('#buttonNew').hide();
    $('#buttonShow').hide();
    $('#Exit').hide();

    $('#modal_close, #overlay, #ADD, #Cancel, #UPDATE, #buttonLoginIn, #buttonEdit').click(function() {
        $('#modal_formTwo, #modal_formThree, #modal_formFour, #modal_formFive, #modal_formEdit')
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

    $('#loginIn').click(function(event) {
        event.preventDefault();
        $('#overlay').fadeIn(
            400,
            function() {
                $('#modal_formFour')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            }
        );
    });

    $('#signUp').click(function() {
        modelWindow();
    });

    $('#buttonLoginIn').click(function() {
        $('#loginIn').hide();
        $('#signUp').hide();
        $('#Exit').show();
        postLoginPersonToServer();
    });

    $('#buttonSignUp').click(function() {
        postPersonsToServer();
    });

    $('#Exit').click(function() {
        $('#infTextarea').val("Sign up or Login in to enter");
        $('#loginIn').show();
        $('#signUp').show();
        $('#Exit').hide();
        $('#buttonNew').hide();
        $('#buttonShow').hide();
        $('table').hide();
    });

    function postLoginPersonToServer() {
        var valueLoginName = $('#loginUserName').val();
        var valueLoginPassword = $('#passwordLogiIn').val();

        $.ajax({
            url: 'http://localhost:8081/loginuser',
            type: 'POST',
            data: {
                name: valueLoginName,
                password: valueLoginPassword
            },
            success: function(data) {
                headerHash = data.hash;
                $('#buttonNew').show();
                $('#buttonShow').show();
                showButtonForPerson();
                $('#infTextarea').val('Congratulations, you have successfully entered');
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function showButtonForPerson() {
        $('#buttonNew').click(function() {
            modelWindow();
        });

        $('#buttonShow').click(function() {
            getPersonsByServer();
        });
    }

    function modelWindow() {
        $(this).hide();
        event.preventDefault();
        $('#overlay').fadeIn(
            400,
            function() {
                $('#modal_formFive')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            }
        );
    }

    function postPersonsToServer() {
        valueName = $('#signUpName').val();
        valueSurname = $('#signUpSurname').val();
        valueAge = $('#signUpAge').val();
        valuePassword = $('#signUpPassword').val();
        valueConfirmPasssword = $('#signUpConfirmPassword').val();
        valueRole = $('#selectRole option:selected').text();

        if (valuePassword === valueConfirmPasssword) {
            $.ajax({
                url: 'http://localhost:8081/user',
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueName,
                    surname: valueSurname,
                    age: valueAge,
                    password: valuePassword,
                    role: valueRole
                },
                success: function(data) {
                    $('#infTextarea').val('Registration completed successfully');
                },
                error: function(data) {
                    $('#infTextarea').val(objERROR[data.responseJSON.message]);
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
            $('#areaForError').text('Passwords do not match');
        }
    }

    function getPersonsByServer() {
        $.ajax({
            url: 'http://localhost:8081/users',
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
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
                        tr.innerHTML = '<td>' + value.nameuser + '</td>' +
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

                        postUpdatePersonToServer(targetId);
                    }
                };
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function deletePersonByServer(targetId) {
        $.ajax({
            url: urlPage + targetId,
            headers: {
                'header-hash': headerHash,
            },
            type: 'DELETE',
            success: function(data) {
                $('#infTextarea').val(data.message);
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function getInfoPersonbyServer(targetId) {
        event.preventDefault();
        $('#overlay').fadeIn(
            400,
            function() {
                $('#modal_formTwo')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            }
        );

        $.ajax({
            url: urlPage + targetId,
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                $('#infoName').text(data[0].nameuser);
                $('#infoSurname').text(data[0].surnameuser);
                $('#infoAge').text(data[0].age);
                $('#infoRole').text(data[0].role);
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function postUpdatePersonToServer(targetId) {
        $.ajax({
            url: urlPage + targetId,
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                event.preventDefault();
                $('#overlay').fadeIn(
                    400,
                    function() {
                        $('#modal_formEdit')
                            .css('display', 'block')
                            .animate({
                                opacity: 1,
                                top: '50%'
                            }, 200);
                    }
                );
                $('#EditName').val(data[0].nameuser);
                $('#EditSurname').val(data[0].surnameuser);
                $('#EditAge').val(data[0].age);
                $('#EditPassword').val(data[0].password);
                $('#selectEditRole option:selected').val(data[0].role)

            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }

        });

        $('#buttonEdit').click(function(event) {
            valueName = $('#EditName').val();
            valueSurname = $('#EditSurname').val();
            valueAge = $('#EditAge').val();
            valuePassword = $('#EditPassword').val();
            valueRole = $('#selectEditRole option:selected').text();
            $.ajax({
                url: urlPage + targetId,
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueName,
                    surname: valueSurname,
                    age: valueAge,
                    password: valuePassword,
                    role: valueRole,
                },
                success: function(data) {
                    $('#infTextarea').val('Update success');

                },
                error: function(data) {
                    $('#infTextarea').val(objERROR[data.responseJSON.message]);
                }
            });
        });
    }
});