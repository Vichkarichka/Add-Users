var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var user = require('../Database/SqlQuery');
var au = require('../Authorization/Authorization');

const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";

router.post('/', function(req, res) {
    var data = req.body;
    user.pushDataToDataBase(data.name, data.surname, data.age, data.password, data.role).then(function(result) {
        if (result.length !== 0) {
            res.status(201).send("Successfully");
        } else {
            res.status(409).json({
                message: ob.objERRORS.USER_CREATE,
            });
        }
    });
});

router.post('/:id', au.checkTokenForDataBase, function(req, res) {
    var data = req.body;
    user.updateDataInDataBase(data.name, data.surname, data.age, data.password, data.role, req.params.id).then(function(result) {
        res.status(200).json({
            message: "Successfully"
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
});

router.get('/:id', au.checkTokenForDataBase, function(req, res) {
    if(req.body.Role  === Role_Guest) {
        res.status(403).json({
            message: ob.objERRORS.USER_RIGTHS,
        });
    }
    if(req.body.Role === Role_User) {
        if (req.body.Id === req.params.id) {
            user.selectAllInformation(req.params.id).then(function(result) {
                res.status(200).json(result);
            }).catch(function(error) {
                res.status(406).json({
                    message: ob.objERRORS.USER_INFO,
                });
            });
        } else {
            user.status(403).json({
                message: ob.objERRORS.USER_RIGTHS,
            });
        }
    } else {
        user.selectAllInformation(req.params.id).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    }
});

router.delete('/:id', au.checkTokenForDataBase, function(req, res) {

    if(req.body.Role === Role_Admin) {
    	user.deletePersonOfDataBase(req.params.id).then(function(result) {
    		 res.status(200).json({
                message: "User delete",
            });
    	}).catch(function(error) {
            res.status(406).json({
                message: ob.objERRORS.USER_DELETE,
            });
        });
    } else {
    	res.status(403).json({
            message: ob.objERRORS.USER_RIGTHS,
        });
    }
});
module.exports = router;