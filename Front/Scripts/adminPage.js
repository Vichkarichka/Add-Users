var headerHash = sessionStorage.getItem('hash');
var urlCountry;
var urlCity;


$(document).ready(function() {
    $('#buttonNewAdmin').show();
    $('#buttonShowAdmin').show();
    $('#ExitAdmin').show();
    $('#modal_close, #overlay, #ADD, #Cancel, #UPDATE, #buttonEdit').click(function() {
        $('#modal_formTwo, #modal_formThree, #modal_formFour, #modal_formFive, #modal_formEdit, #modal_formCountry, #modal_formCity,' +
                '#modal_formEditCountry, #modal_formCityEdit, #modal_formSchool')
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

    $('#createCity').click(function() {
        getCountriesByCity();
        createCity();
    });

    $('#createSchool').click(function() {
        getCountriesBySchool()
        createSchool();
    });

    $('#selectContrySchool').on('change', function() {
        var checkContry = $(this).find(":checked").val();
        getCitySchool(checkContry);
    });

    $('#showCity').click(function() {
        $("table").hide();
        $("#countrytable").hide();
        showCity();
    });

    $('#showSchool').click(function() {
        $("table").hide();
        $("#countrytable").hide();
        $("#citytable").hide();
        showSchool();
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
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + "Country" + '</td>'
                table.appendChild(tr);
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
        var urlCountry = "http://localhost:8081/user/country/" + targetId;
        requestDelete(urlCountry);
    }

    function editCountry(targetId) {
        urlCountry = 'http://localhost:8081/user/country/' + targetId;
        $.ajax({
            url: urlCountry,
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                var modalForm = $('#modal_formEditCountry');
                getModalForm(modalForm);
                $('#countryEditName').val(data[0].Name);
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    $('#EditCountry').click(function() {
        var valueNameCountry = $('#countryEditName').val();
        $.ajax({
            url: urlCountry,
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

    function createCountry() {
        var modalForm = $('#modal_formCountry');
        getModalForm(modalForm);
    }

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

    function showCity() {
        $.ajax({
            url: 'http://localhost:8081/user/cities',
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                var tableForCity = document.createElement('div');
                if (document.getElementById('citytable')) {
                    var elem = document.getElementById('citytable');
                    elem.parentNode.removeChild(elem);
                }
                tableForCity.setAttribute('id', 'citytable');
                var table = document.createElement('table');
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + "City" + '</td>' +
                    '<td>' + "Country" + '</td>';
                table.appendChild(tr);
                $.each(data, function(index, value) {
                    if (value !== null) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + value.Name + '</td>' +
                            '<td>' + value.country + '</td>' +
                            '<button class="EditCity">Edit</button>' +
                            '<button class="DeleteCity">Delete</button>';
                        tr.setAttribute('id', value.id);
                        table.appendChild(tr);
                    }
                });
                tableForCity.appendChild(table);
                document.body.appendChild(tableForCity);
                tableForCity.onclick = function(event) {
                    var target = event.target;
                    var targetId = +target.parentNode.getAttribute('id');
                    if (target.className == 'DeleteCity') {
                        deleteCity(targetId);
                    }
                    if (target.className == 'EditCity') {
                        getCountriesByCityEdit();
                        editCity(targetId);
                    }
                };
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function createCity() {
        var modalForm = $('#modal_formCity');
        getModalForm(modalForm);
    }

    $('#addNewCity').click(function() {
        var valueNameCountry = $('#selectContry option:selected').val();
        var valueNameCity = $('#cityName').val();
        $.ajax({
            url: 'http://localhost:8081/user/city',
            headers: {
                'header-hash': headerHash,
            },
            type: 'POST',
            data: {
                name: valueNameCity,
                countryName: valueNameCountry,
            },
            success: function(data) {
                $('#infTextarea').val('New city add successfully');
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    });

    function deleteCity(targetId) {
        var urlCity = "http://localhost:8081/user/city/" + targetId;
        requestDelete(urlCity);
    }

    function editCity(targetId) {
        urlCity = 'http://localhost:8081/user/city/' + targetId;
        $.ajax({
            url: urlCity,
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                var modalForm = $('#modal_formCityEdit');
                getModalForm(modalForm);
                $('#cityNameEdit').val(data[0].Name);
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }
    $('#EditCity').click(function() {
        var valueNameCountry = $('#selectContryEdit option:selected').val();
        var valueNameCity = $('#cityNameEdit').val();
        $.ajax({
            url: urlCity,
            headers: {
                'header-hash': headerHash,
            },
            type: 'POST',
            data: {
                name: valueNameCity,
                countryName: valueNameCountry,
            },
            success: function(data) {
                $('#infTextarea').val('New country add successfully');
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    });

    function showSchool() {
        $.ajax({
            url: 'http://localhost:8081/user/schools',
            headers: {
                'header-hash': headerHash,
            },
            type: 'GET',
            success: function(data) {
                console.log(data);
                var tableForSchool = document.createElement('div');
                if (document.getElementById('schooltable')) {
                    var elem = document.getElementById('schooltable');
                    elem.parentNode.removeChild(elem);
                }
                tableForSchool.setAttribute('id', 'schooltable');
                var table = document.createElement('table');
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + "School" + '</td>' +
                    '<td>' + "City" + '</td>' +
                    '<td>' + "Country" + '</td>';
                table.appendChild(tr);
                $.each(data, function(index, value) {
                    if (value !== null) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + value.Name + '</td>' +
                            '<td>' + value.City + '</td>' +
                            '<td>' + value.Country + '</td>' +
                            '<button class="EditSchool">Edit</button>' +
                            '<button class="DeleteSchool">Delete</button>';
                        tr.setAttribute('id', value.id);
                        table.appendChild(tr);
                    }
                });
                tableForSchool.appendChild(table);
                document.body.appendChild(tableForSchool);
                tableForSchool.onclick = function(event) {
                    var target = event.target;
                    var targetId = +target.parentNode.getAttribute('id');
                    if (target.className == 'DeleteSchool') {
                        deleteSchool(targetId);
                    }
                    if (target.className == 'EditSchool') {

                    }
                };
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    }

    function createSchool() {
        var modalForm = $('#modal_formSchool');
        getModalForm(modalForm);
    }

    $('#addSchool').click(function() {
        var valueNameCountry = $('#selectContrySchool option:selected').val();
        var valueNameCity = $('#selectCitySchool option:selected').val();
        var valueNameSchool = $('#schoolName').val();
        $.ajax({
            url: 'http://localhost:8081/user/school',
            headers: {
                'header-hash': headerHash,
            },
            type: 'POST',
            data: {
                name: valueNameSchool,
                countryName: valueNameCountry,
                cityName: valueNameCity,
            },
            success: function(data) {
                $('#infTextarea').val('New School add successfully');
            },
            error: function(data) {
                $('#infTextarea').val(objERROR[data.responseJSON.message]);
            }
        });
    });

    function deleteSchool(targetId) {
        var urlSchool = "http://localhost:8081/user/school/" + targetId;
        requestDelete(urlSchool);
    }

    function requestDelete(urlRequest) {
        $.ajax({
            url: urlRequest,
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
});