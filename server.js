var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();
var port = 8082;
var headerId, headerRole;
const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));


var persons = [];
var id = 0;

function Human(name, surname, age, id, password, role) {
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.password = password;
    this.role = role;
    this.id = id;
}
var human = new Human();

app.use(function(req, res, next) {

    headerId = req.headers["header-id"];
    headerRole = req.headers["header-role"];
    next();
});

app.use('/user', function(req, res, next) {

    var data = req.body;
    var arrayNames = persons.map((item) => item.name);
    var find = arrayNames.includes(data.name);

    if (find == false) {
        next();

    } else {
        res.status(400).send("Wrong");
    }

});

app.use('/user/:id', function(req, res, next) {

    var data = req.body;
    var arrayNames = persons.map((item) => item.name);
    var find = arrayNames.includes(data.name);

    if (find == false) {
        next();

    } else {
        res.status(400).send("Wrong");
    }

});


app.post('/user', function(req, res) {
    var data = req.body;
    var newHuman = new Human(data.name, data.surname, data.age, id, data.password, data.role);
    req.checkBody('name', 'name is required').notEmpty().isAlpha();
    req.checkBody('surname', 'surname is required').notEmpty().isAlpha();
    req.checkBody('age', 'age is required').notEmpty().isInt();
    req.checkBody('password', 'password is required').notEmpty().isLength({
        min: 5,
        max: 10
    });

        var errors = req.validationErrors();
    if (errors) {
        res.status(400).send('Error: ' + errors.message);
        return;
    } else {
    	    persons.push(newHuman);
    res.status(200).send(String(id++));
    }



});

app.post('/user/:id', function(req, res) {
    var data = req.body;



    if (persons[req.params.id]) {

        req.checkBody('name', 'name is required').notEmpty().isAlpha();
        req.checkBody('surname', 'surname is required').notEmpty().isAlpha();
        req.checkBody('age', 'age is required').notEmpty().isInt();
        req.checkBody('password', 'password is required').notEmpty().isLength({
            min: 5,
            max: 10
        });


        var errors = req.validationErrors();
        if (errors) {
            res.status(400).send('Error: ' + errors.message);
            return;
        }
        var oldPersons = persons[req.params.id];
        oldPersons.name = data.name;
        oldPersons.surname = data.surname;
        oldPersons.age = data.age;
        res.status(200).send("Sucusess");

    } else {
        res.status(400).send("Fail");
    }


});
app.post('/loginuser', function(req, res) {

    var data = req.body;
    for (var i = 0; i < persons.length; i++) {
        if (data.name === persons[i].name && data.password == persons[i].password) {
            res.status(200);
            res.json({
                'role': persons[i].role,
                'id': persons[i].id
            });
            return;
        }
    }
    res.status(400).send("Wrong");

});

app.get('/user/:id', function(req, res) {

    if (headerRole == Role_Guest) {

        res.status(403).send("Forbidden");
    }

    if (persons[req.params.id]) {
        res.status(200).send(persons[req.params.id]);
    } else {
        res.status(400).send("Fail");
    }


});
app.delete('/user/:id', function(req, res) {

    if (headerRole == Role_Admin) {
        if (persons[req.params.id]) {
            delete persons[req.params.id];
            res.status(200).send("User delete");
        } else {
            res.status(400).send("Fail");

        }
    } else {
        res.status(403).send("Forbidden");
    }

});

app.get('/users', function(req, res) {



    if (headerRole == Role_User || headerRole == Role_Guest) {

        res.status(200).send(new Human(persons[headerId]));

    } else {

        res.status(200).send(persons);


    }

});


app.listen(port);
console.log("Example app listening at http://%s:", port);