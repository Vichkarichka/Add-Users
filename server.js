var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();
var port = 8082;

app.use(bodyParser.json()); 
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));


var persons = [];
var id = 0 ;

function Human(name,surname,age,id){
	this.name = name;
	this.surname = surname;
	this.age = age;
	this.id = id;
}
var human = new Human();

app.post('/user',function(req,res){
	//console.log("POST_ONE");
	var data = req.body;
	var newHuman = new Human(data.name, data.surname, data.age, id);


	req.checkBody('name', 'name is required').notEmpty().isAlpha();
	req.checkBody('surname', 'surname is required').notEmpty().isAlpha();
	req.checkBody('age', 'age is required').notEmpty().isInt();


  var errors = req.validationErrors();
  if (errors) {
    res.status(400).send('Error: ' + errors.message);
    return;
  }else
  {

  	persons.push(newHuman);
	res.send(String(id++));
}
});

app.post('/user/:id',function(req,res){
	console.log("UPDATE");
	var data = req.body;

		if(persons[req.params.id])
		{
			req.checkBody('name', 'name is required').notEmpty().isAlpha();
			req.checkBody('surname', 'surname is required').notEmpty().isAlpha();
			req.checkBody('age', 'age is required').notEmpty().isInt();


  			var errors = req.validationErrors();
 			if (errors) {
    		res.status(400).send('Error: ' + errors.message);
    		return;
  		}

			var oldPersons = persons[req.params.id];
			oldPersons.name = data.name;
        	oldPersons.surname = data.surname;
        	oldPersons.age = data.age;
			res.send("Sucusess");
			console.log(persons[req.params.id]);
		}
		else
		{
			res.send("Fail");
		}

});
app.get('/user/:id',function(req,res){

		if(persons[req.params.id])
		{
			res.send(persons[req.params.id]);
		}
		else
		{
			res.send("Fail");
		}

	console.log("GET_One_users");

});
app.delete('/user/:id',function(req,res){
	console.log("DELETE");

		if(persons[req.params.id])
		{
			delete persons[req.params.id];
			res.send("User delete");
			console.log(persons);
		}
		else
		{
			res.send("Fail");

		}

});

app.get('/users',function(req,res){
	res.set("Access-Control-Allow-Origin", "*");
	res.send(persons);
	console.log("GET_USERS");

});


app.listen(port);
console.log("Example app listening at http://%s:", port);