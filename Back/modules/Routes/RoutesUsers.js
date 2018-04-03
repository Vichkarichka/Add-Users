var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var user = require('../Database/SqlQuery');
var au = require('../Authorization/Authorization');
var role = require('../Authorization/Role');


var Role_Admin;
var Role_Guest;
var Role_User;

function getRoles() {
    role.getRole().then(function(result) {
        Role_Guest = result.guest;
        Role_Admin = result.admin;
        Role_User = result.user;
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
}
     getRoles();

router.get('/', au.checkTokenForDataBase, function(req, res) {

    if(req.body.Role === Role_Guest) {
        user.selectAllInformation(req.body.Id).then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    } else {
        user.selectAllInformationDB().then(function(result) {
            res.status(200).send(result);
        }).catch(function(error) {
            res.status(400).json({
                message: ob.objERRORS.CONNECT,
            });
        });
    }
});

module.exports = router;