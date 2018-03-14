var valueName,valueSurname,valueAge;
var urlPage = "http://localhost:8082/user/";

$(document).ready(function() { 
	$('#buttonNew').click( function(event){ 
		modelWindow()
	});

	
	$('#modal_close, #overlay, #ADD, #Cancel,#UPDATE').click( function(){ 
		$('#modal_form, #modal_formTwo, #modal_formThree')
			.animate({opacity: 0, top: '45%'}, 200,  
				function(){ 
					$(this).css('display', 'none'); 
					$('#overlay').fadeOut(400);
				}
			);
	});


	$("#ADD").click(function(event){

		postPersonsToServer();

	});
	$('#buttonShow').click(function(event){
		getPersonsByServer();

	});


	function postPersonsToServer(){

		valueName = $("#inputName").val();
		valueSurname = $("#inputSurname").val();
		valueAge = $("#inputAge").val();
		$.ajax({
			url:"http://localhost:8082/user",
			type:"POST",
			data:{name:valueName,surname:valueSurname,age:valueAge },
			success: function(){

				alert("Add person success");
				console.log('Successfully connected to the server');

			},
			error: function(){

				alert("Wrong name or surname or age");
				console.log('Something went wrong');
			}
		});
	}

	function getPersonsByServer(){

	$.get( "http://localhost:8082/users", function( data ) {

		var tableForPersons = document.createElement('div');
    if (document.getElementById('userstable')) {
        var elem = document.getElementById('userstable');
       elem.parentNode.removeChild(elem);
    }
    tableForPersons.setAttribute('id', 'userstable');
    var table = document.createElement('table');
    data.forEach(element => {
        if (element !== null) {
            var tr = document.createElement('tr');
            tr.innerHTML ='<td>' + element.name + '</td>' +
            '<button class="EditByPerson">Edit</button>' + 
            '<button class="info">Info</button>' + 
            '<button class="del">Delete</button>';
            tr.setAttribute('id', element.id);
            table.appendChild(tr);
        }
    });
    tableForPersons.appendChild(table);
    document.body.appendChild(tableForPersons);

    	tableForPersons.onclick = function(event) {

        var target = event.target;
        var targetId = +target.parentNode.getAttribute('id');

        if(target.className == 'del') {
            
            deletePersonByServer(targetId);
        }
        if(target.className == 'info')
        {
        	getInfoPersonbyServer(targetId);
        }
        if(target.className == 'EditByPerson')
        {
        	postUpdatePersonToServer(targetId);
        }
    }
	
});
	}

	function deletePersonByServer(targetId){
		$.ajax({
    url: urlPage + targetId,
    type: 'DELETE',
    success: function(result) {

    	alert(result);
        console.log('Successfully connected to the server');
    },
    error: function(result) {

    	alert(result);
        console.log('Error');
    }
});
	}
	function modelWindow(){

		event.preventDefault(); 
		$('#overlay').fadeIn(400, 
		 	function(){ 
				$('#modal_form') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
		});

	}


	function getInfoPersonbyServer(targetId){

		event.preventDefault(); 
		$('#overlay').fadeIn(400, 
		 	function(){ 
				$('#modal_formTwo') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
		});

		$.get( urlPage +targetId, function( data ) {
			console.log(data.name);

			 $( "#infoName" ).text(data.name);
			 $( "#infoSurname" ).text(data.surname); 
			 $( "#infoAge" ).text(data.age);  

   });
	}

	function postUpdatePersonToServer(targetId)
	{
		event.preventDefault(); 
		$('#overlay').fadeIn(400, 
		 	function(){ 
				$('#modal_formThree') 
					.css('display', 'block') 
					.animate({opacity: 1, top: '50%'}, 200); 
		});

		$.get( urlPage + targetId, function( data ) {

			 $( "#updateName" ).val(data.name);
			 $( "#updateSurname" ).val(data.surname); 
			 $( "#updateAge" ).val(data.age); 
		});

		$("#UPDATE").click(function(event){

		valueName = $("#updateName").val();
		valueSurname = $("#updateSurname").val();
		valueAge = $("#updateAge").val();
		$.ajax({
			url: urlPage + targetId,
			type:"POST",
			data:{name:valueName,surname:valueSurname,age:valueAge },
			success: function(data){

				//alert(data);
				console.log('Successfully connected to the server');

			},
			error: function(){

				//alert(" Bad update person");
				console.log('Something went wrong');
			}
		});

	});
	}
});