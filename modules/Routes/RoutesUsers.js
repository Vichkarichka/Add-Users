var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var user = require('../Database/SqlQuery');
var au = require('../Authorization/Authorization');

const Role_Admin = "Admin";
const Role_Guest = "Guest";
const Role_User = "User";

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