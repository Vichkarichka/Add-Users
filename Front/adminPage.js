
var headerHash = sessionStorage.getItem('hash');

$(document).ready(function() {

    $('#buttonNewAdmin').show();
    $('#buttonShowAdmin').show();
    $('#ExitAdmin').show();
    $('#modal_close, #overlay, #ADD, #Cancel, #UPDATE, #buttonEdit').click(function() {
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

    $('#buttonNewAdmin').click(function() {
        getCountriesSignUp();
        var modalForm = $('#modal_formFive');
        getModalForm(modalForm);
    });
    $('#buttonShowAdmin').click(function() {
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

    $('#ExitAdmin').click(function() {
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
                        tr.innerHTML = '<td>' + value.Name + '</td>' +
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

    function createCountry() {
        var modalForm = $('#modal_formCountry');
        getModalForm(modalForm);
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
});