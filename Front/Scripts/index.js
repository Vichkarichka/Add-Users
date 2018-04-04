var urlPage = 'http://localhost:8081/user/';
var headerId;
var headerRole;
var headerHash;

$(document).ready(function() {

    $('#buttonNew').hide();
    $('#buttonShow').hide();
    $('#Exit').hide();
    $('#modal_close, #overlay, #ADD, #Cancel, #UPDATE, #buttonLoginIn, #buttonEdit, #buttonSignUp').click(function() {
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
        var modalForm = $('#modal_formFour');
        getModalForm(modalForm);
    });
    $('#signUp').click(function() {
        getCountriesSignUp();
        var modalForm = $('#modal_formFive');
        getModalForm(modalForm);
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
                headerRole = data.role;
                if (headerRole !== 1) {
                    $('#buttonNew').show();
                    $('#buttonShow').show();
                    showButtonForPerson();
                    $('#infTextarea').val('Congratulations, you have successfully entered');
                } else {
                    sessionStorage.setItem('hash', headerHash);
                    document.location.href = 'AdminPage.html';
                }
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function showButtonForPerson() {
        $('#buttonNew').click(function() {
            getCountriesSignUp();
            var modalForm = $('#modal_formFive');
            getModalForm(modalForm);
        });
        $('#buttonShow').click(function() {
            getPersonsByServer();
        });
    }
});