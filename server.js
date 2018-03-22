var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
//var database = require('./database');
var mysql = require('promise-mysql');


var app = express();
const port = 8081;
var headerId;
var headerRole;
const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";
var arrayNames;
var row;



app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));

var connect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Users',
    connectionLimit: 100,

});


function pushDataToDataBase(name, surname, age, password, role) {

    var people = {
        nameuser: name,
        surnameuser: surname,
        age: age,
        password: password,
        role: role,
    };
    connect.getConnection().then(function(conn) {

        var result = conn.query("INSERT INTO Human SET ?", people, function(err, result, fields) {
            if (err) throw err;
            conn.release(conn);
        });
    });
}



app.use('/', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    if (req.method !== "OPTIONS") {
        next();
    }
    if (req.method === "OPTIONS") {
        res.send();
    }
});

app.use(function(req, res, next) {

    headerId = req.headers["header-id"];
    headerRole = req.headers["header-role"];
    next();
});

app.post('/user', function(req, res, next) {

    var data = req.body;

    connect.getConnection().then(function(conn) {
        var resultName = conn.query("SELECT nameuser FROM Human WHERE nameuser = ? ", data.name);
        conn.release(conn);
        return resultName;
    }).then(function(rows) {

        if (rows.length === 0) {
            return next();
        } else {
            res.status(400).send("Wrong");
        }
    });
});

app.post('/user', function(req, res, next) {

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
        next();
    }

});


app.post('/user', function(req, res) {
    var data = req.body;
    pushDataToDataBase(data.name, data.surname, data.age, data.password, data.role);
    res.status(200).send("Successfully");

});

app.post('/user/:id', function(req, res) {

    var data = req.body;
    if (persons[req.params.id]) {

        var oldPersons = persons[req.params.id];
        oldPersons.name = data.name;
        oldPersons.surname = data.surname;
        oldPersons.age = data.age;
        oldPersons.password = data.password;
        res.status(200).json({
            message: "Successfully"
        });

    } else {

        res.status(400).send({
            message: "Fail"
        });

    }


});
app.post('/loginuser', function(req, res) {

    var data = req.body;

    connect.getConnection().then(function(conn) {

        var resultLogin = conn.query("SELECT nameuser, password, role, id FROM Human WHERE nameuser = ? AND password = ?", [data.name, data.password]);
        conn.release(conn);
        return resultLogin;
    }).then(function(rows) {
        if (rows.length === 0) {
            res.status(400).send("Wrong");
        } else {
            Object.keys(rows).forEach(function(key) {
                var row = rows[key];
                res.status(200);
                res.json({
                    'role': row.role,
                    'id': row.id,
                });
                return;
            });
        }
    }).catch(function(error) {
        console.log(error);
    });
});

app.get('/user/:id', function(req, res) {

    if (headerRole === Role_Guest) {

        res.status(403).json({
            message: "Sorry, you do not have the rights"

        });

    } else {

        connect.getConnection().then(function(conn) {

            var resultInfo = conn.query("SELECT * FROM Human WHERE id = ?", req.params.id);
            conn.release(conn);
            return resultInfo;

        }).then(function(rows) {

            res.status(200).json(rows);

        }).catch(function(error) {

            res.status(400).json({
                message: "Sorry, something went wrong "

            });

        });
    }
});

app.delete('/user/:id', function(req, res) {

    if (headerRole === Role_Admin) {

        connect.getConnection().then(function(conn) {
        	
            var resultDelete = conn.query("DELETE FROM Human WHERE id = ?", req.params.id);
            conn.release(conn);
            return resultDelete;

        }).then(function(rows) {
        	console.log(rows);
            res.status(200).json({
                message: "User delete",
            });

        }).catch(function(error) {

            res.status(400).json({
                message: "Fail"
            });
        });
    } else {
        res.status(403).json({
            message: "Sorry, you do not have the rights"
        });
    }

});

app.get('/users', function(req, res) {

    if (headerRole === Role_User || headerRole === Role_Guest) {

        connect.getConnection().then(function(conn) {

            var resultShow = conn.query("SELECT * FROM Human WHERE id = ?", headerId);
            conn.release(conn);
            return resultShow;

        }).then(function(rows) {

            res.status(200).send(rows);

        }).catch(function(error) {

            res.status(400).json({
                message: "Sorry, something went wrong ",

            });
        });
    } else {
        connect.getConnection().then(function(conn) {

            var resultShow = conn.query("SELECT * FROM Human");
            conn.release(conn);
            return resultShow;

        }).then(function(rows) {

            res.status(200).send(rows);

        }).catch(function(error) {

            res.status(400).json({
                message: "Sorry, something went wrong ",

            });
        });
    }

});

app.listen(port);
console.log("Example app listening at http://%s:", port);