var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var admin = require('../Database/SqlQueryAdmin');
var au = require('../Authorization/Authorization');


router.post('/school', function(req, res) {
    var data = req.body;
    admin.insertNewSchool(data).then(function(result) {
        admin.insertSchoolToCities(data, result.insertId).then(function(result) {
            res.status(200).json("ADD");
        }).catch(function(error) {
            res.status(406).json({
                message: ob.objERRORS.USER_INFO,
            });
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.get('/schools', function(req, res) {
    admin.getSchools().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.delete('/school/:id', function(req, res) {
    console.log(req.params);
    admin.deleteSchoolOfDataBase(req.params.id).then(function(result) {
        res.status(200).json({
            message: "Schools delete",
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_DELETE,
        });
    });
});

module.exports = router;