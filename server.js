var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var app = express();
var port = 8082;
var headerId, headerRole;
const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";
var arrayNames;

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

app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use(function(req, res, next) {

    headerId = req.headers["header-id"];
    headerRole = req.headers["header-role"];
    next();
});

app.use('/user', function(req, res, next) {

    var data = req.body;
    arrayNames = persons.map((item) => item.name);
    var newArrayNames = arrayNames.filter(Boolean);
    var find = newArrayNames.includes(data.name);
    if (find == false) {
        next();

    } else {
        res.status(400).send("Wrong");
    }

});

app.use('/user/:id', function(req, res, next) {

    var data = req.body;
    arrayNames = persons.map((item) => item.name);
    var newArrayNames = arrayNames.filter(Boolean);
    var find = newArrayNames.includes(data.name);

    if (find == false) {
        next();

    } else {
        res.status(400).send("Wrong");
    }

});


app.post('/user', function(req, res) {
    var data = req.body;
    var newHuman = new Human(data.name, data.surname, data.age, id, data.password, data.role);
    req.checkBody('name', 'Invalid field Name values').notEmpty().isAlpha();
    req.checkBody('surname', 'Invalid field Surname values').notEmpty().isAlpha();
    req.checkBody('age', 'Invalid field Age values').notEmpty().isInt();
    req.checkBody('password', 'Invalid field Password values').notEmpty().isLength({
        min: 5
    });

    var errors = req.validationErrors();
    if (errors) {
        for (var i = 0; i < errors.length; i++) {
            res.status(400).send('Error: ' + errors[i].msg);
            return;
        }
    } else {
        persons.push(newHuman);
        res.status(200).send(String(id++));
    }



});

app.post('/user/:id', function(req, res) {

    var data = req.body;
    if (persons[req.params.id]) {

        req.checkBody('name', 'Invalid field Name values').notEmpty().isAlpha();
        req.checkBody('surname', 'Invalid field Surname values').notEmpty().isAlpha();
        req.checkBody('age', 'Invalid field Age values').notEmpty().isInt();
        req.checkBody('password', 'Invalid field Password values').notEmpty().isLength({
            min: 5
        });


        var errors = req.validationErrors();
        if (errors) {
            for (var i = 0; i < errors.length; i++) {
                res.status(400).send('Error: ' + errors[i].msg);
                return;
            }
        }
        var oldPersons = persons[req.params.id];
        oldPersons.name = data.name;
        oldPersons.surname = data.surname;
        oldPersons.age = data.age;
        oldPersons.password = data.password;
        res.status(200).json({message:"Successfully"});

    } else {

        res.status(400).send({message:"Fail"});

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
    res.status(400).json({message:"Wrong Name or Password"});;

});

app.get('/user/:id', function(req, res) {

    if (headerRole == Role_Guest) {

        res.status(403).send("Forbidden");
    } else {

        if (persons[req.params.id]) {
            res.status(200).send(persons[req.params.id]);
        } else {
            res.status(400).send("Fail");
        }
    }


});
app.delete('/user/:id', function(req, res) {

    if (headerRole == Role_Admin) {
        if (persons[req.params.id]) {
            delete persons[req.params.id];
            console.log(arrayNames);
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