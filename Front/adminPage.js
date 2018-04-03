var urlPage = 'http://localhost:8081/user/';
var headerId;
var headerRole;
var headerHash = sessionStorage.getItem('hash');

const objERROR = {
    USER_LOGIN_ERROR: "Incorrect login or password. Try again",
    USER_CREATE_ERROR: "User with this name exists.",
    USER_INFO_ERROR: "User is not find",
    USER_UPDATE_ERROR: "User can not update",
    USER_RIGTHS_ERROR: "Sorry, you do not have the rights",
    USER_DELETE_ERROR: "User already delete",
    TIMESTAMP_TIMEOUT_ERROR: "The session is over, please re-login",
    INVALID_TOKEN_ERROR: "The session is not find,please re-login",
    TOKEN_INSERT_ERROR: "Can not insert session, please re-login",
    TOKEN_UPDATE_ERROR: "Can not refresh session,please re-login",
    CONNECT_ERROR: "Try again",
    USER_NAME_ERROR: "Invalid field Name values",
    USER_SURNAME_ERROR: "Invalid field Surname values",
    USER_AGE_ERROR: "Invalid field Age values",
    USER_PASSWORD_ERROR: "Invalid field Password values",
};


$(document).ready(function() {

    $('#buttonNew').show();
    $('#buttonShow').show();
    $('#Exit').show();
    $('#modal_close, #overlay, #ADD, #Cancel, #UPDATE, #buttonLoginIn, #buttonEdit').click(function() {
        $('#modal_formTwo, #modal_formThree, #modal_formFour, #modal_formFive, #modal_formEdit, #modal_formCountry')
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

    $('#buttonNew').click(function() {
        getCountriesSignUp();
        modelWindow();
    });
    $('#buttonShow').click(function() {
        getPersonsByServer();
        $("#countrytable").hide();
    });

    $('#addCountry').click(function() {
        $("table").hide();
        showCountry();
    });

    $('#createCountry').click(function() {
        createCountry();
    });

    $('#Exit').click(function() {
        document.location.href = 'main.html';
    });
    $('#selectSignUpContry').on('change', function() {
        var checkContry = $(this).find(":checked").val();
        getCitySignUp(checkContry);
    });
    $('#selectSignUpCity').on('change', function() {
        var checkCity = $(this).find(":checked").val();
        getSchoolSignUp(checkCity);
    });
    $('#selectEditContry').on('change', function() {
        var checkContry = $(this).find(":checked").val();
        getCityEdit(checkContry);
    });
    $('#selectEditCity').on('change', function() {
        var checkCity = $(this).find(":checked").val();
        getSchoolEdit(checkCity);
    });

    function getCountry(selectContry) {
        $.ajax({
            url: 'http://localhost:8081/user',
            type: 'GET',
            success: function(data) {

                var output = [];
                $.each(data, function(key, value) {
                    output.push('<option value="' + value.id + '">' + value.name + '</option>');
                });
                selectContry.html(output.join(''));

            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function getCity(selectCity, checkContry) {
        $.ajax({
            url: 'http://localhost:8081/user/city',
            headers: {
                'header-contry': checkContry,
            },
            type: 'GET',
            success: function(data) {
                var output = [];
                $.each(data, function(key, value) {
                    output.push('<option value="' + value.id + '">' + value.Name + '</option>');
                });
                selectCity.html(output.join(''));
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function getSchool(selectShool, checkCity) {
        $.ajax({
            url: 'http://localhost:8081/user/school',
            headers: {
                'header-city': checkCity,
            },
            type: 'GET',
            success: function(data) {
                var output = [];
                $.each(data, function(key, value) {
                    output.push('<option value="' + value.id + '">' + value.Name + '</option>');
                });
                selectShool.html(output.join(''));
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function getCityEdit(checkContry) {
        var selectCity = $('#selectEditCity');
        getCity(selectCity, checkContry);
    }

    function getCountriesEdit() {
        var selectContry = $('#selectEditContry');
        getCountry(selectContry);
    }

    function getSchoolSignUp(checkCity) {
        var selectShool = $('#selectSignUpSchool');
        getSchool(selectShool, checkCity);
    }

    function getSchoolEdit(checkCity) {
        var selectShool = $('#selectEditSchool');
        getSchool(selectShool, checkCity);
    }

    function getCitySignUp(checkContry) {
        var selectCity = $('#selectSignUpCity');
        getCity(selectCity, checkContry);
    }

    function getCountriesSignUp() {
        var selectContry = $('#selectSignUpContry');
        getCountry(selectContry);
    }

    function showCountry() {
        $.ajax({
            url: 'http://localhost:8081/user',
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                console.log(data);
                var tableForCountry = document.createElement('div');
                if (document.getElementById('countrytable')) {
                    var elem = document.getElementById('countrytable');
                    elem.parentNode.removeChild(elem);
                }
                tableForCountry.setAttribute('id', 'countrytable');
                var table = document.createElement('table');
                $.each(data, function(index, value) {
                    if (value !== null) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + value.name + '</td>' +
                            '<button class="EditCountry">Edit</button>' +
                            '<button class="DeleteCountry">Delete</button>';
                        tr.setAttribute('id', value.id);
                        table.appendChild(tr);
                    }
                });
                tableForCountry.appendChild(table);
                document.body.appendChild(tableForCountry);
                tableForCountry.onclick = function(event) {
                    var target = event.target;
                    var targetId = +target.parentNode.getAttribute('id');
                    if (target.className == 'DeleteCountry') {
                        deleteCountry(targetId);
                    }
                    if (target.className == 'EditCountry') {
                        editCountry(targetId);
                    }
                };
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function deleteCountry(targetId) {
        $.ajax({
            url: "http://localhost:8081/user/country/" + targetId,
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

    function editCountry(targetId) {
        $.ajax({
            url: 'http://localhost:8081/user/country/' + targetId,
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                $(this).hide();
                event.preventDefault();
                $('#overlay').fadeIn(
                    400,
                    function() {
                        $('#modal_formCountry')
                            .css('display', 'block')
                            .animate({
                                opacity: 1,
                                top: '50%'
                            }, 200);
                    }
                );
                $('#countryName').val(data[0].Name);
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
        $('#addNewCountry').click(function() {
            var valueNameCountry = $('#countryName').val();
            $.ajax({
                url: 'http://localhost:8081/user/country/' + targetId,
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueNameCountry,
                },
                success: function(data) {
                    $('#infTextarea').val('New country add successfully');
                },
                error: function(data) {
                    $('#infTextarea').val(objERROR[data.responseJSON.message]);
                }
            });
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

    function createCountry() {
        $(this).hide();
        event.preventDefault();
        $('#overlay').fadeIn(
            400,
            function() {
                $('#modal_formCountry')
                    .css('display', 'block')
                    .animate({
                        opacity: 1,
                        top: '50%'
                    }, 200);
            }
        );
        $('#addNewCountry').click(function() {
            var valueNameCountry = $('#countryName').val();
            $.ajax({
                url: 'http://localhost:8081/user/country',
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueNameCountry,
                },
                success: function(data) {
                    $('#infTextarea').val('New country add successfully');
                },
                error: function(data) {
                    $('#infTextarea').val(objERROR[data.responseJSON.message]);
                }
            });
        });
    }

    function postPersonsToServer() {

        var valueSignUp = {
            valueName: $('#signUpName').val(),
            valueSurname: $('#signUpSurname').val(),
            valuePassword: $('#signUpPassword').val(),
            valueConfirmPasssword: $('#signUpConfirmPassword').val(),
            valueRole: $('#selectRole option:selected').val(),
            valueBirthDay: $('#signUpBithDay').val(),
            valueCountry: $('#selectSignUpContry option:selected').val(),
            valueCity: $('#selectSignUpCity option:selected').val(),
            valueSchool: $('#selectSignUpSchool option:selected').val(),
            valueBIO: $('#SignUpBIO').val(),
        };

        if (valueSignUp.valuePassword === valueSignUp.valueConfirmPasssword) {
            $.ajax({
                url: 'http://localhost:8081/user',
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueSignUp.valueName,
                    surname: valueSignUp.valueSurname,
                    password: valueSignUp.valuePassword,
                    role: valueSignUp.valueRole,
                    birthday: valueSignUp.valueBirthDay,
                    country: valueSignUp.valueCountry,
                    city: valueSignUp.valueCity,
                    school: valueSignUp.valueSchool,
                    bio: valueSignUp.valueBIO,
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
                        getCountriesEdit();
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
                $('#infoRole').text(data[0].role);
                $('#infoBirthDay').text(data[0].Birth_Date);
                $('#infoCountry').text(data[0].country);
                $('#infoCity').text(data[0].city);
                $('#infoSchool').text(data[0].school);
                $('#infoBIO').text(data[0].BIO);
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
                $('#EditPassword').val(data[0].password);
                $('#EditBithDay').val(data[0].Birth_Date);
                $('#EditBIO').val(data[0].BIO);
                $("#selectEditRole :contains(data[0].role)").attr("selected", "selected");
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
        $('#buttonEdit').click(function(event) {
            var valueUpdate = {
                valueName: $('#EditName').val(),
                valueSurname: $('#EditSurname').val(),
                valuePassword: $('#EditPassword').val(),
                valueRole: $('#selectEditRole option:selected').val(),
                valueBirthDay: $('#EditBithDay').val(),
                valueCountry: $('#selectEditContry option:selected').val(),
                valueCity: $('#selectEditCity option:selected').val(),
                valueSchool: $('#selectEditSchool option:selected').val(),
                valueBIO: $('#EditBIO').val(),
            };
            $.ajax({
                url: urlPage + targetId,
                headers: {
                    'header-hash': headerHash,
                },
                type: 'POST',
                data: {
                    name: valueUpdate.valueName,
                    surname: valueUpdate.valueSurname,
                    password: valueUpdate.valuePassword,
                    role: valueUpdate.valueRole,
                    birthday: valueUpdate.valueBirthDay,
                    country: valueUpdate.valueCountry,
                    city: valueUpdate.valueCity,
                    school: valueUpdate.valueSchool,
                    bio: valueUpdate.valueBIO,
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