var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var admin = require('../Database/SqlQueryAdmin');
var au = require('../Authorization/Authorization');
var vl = require('../Validation/validation');
var uniq = require('../Authorization/Uniq');


router.post('/school', uniq.checkSchoolForDataBase, function(req, res) {
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

router.get('/schools', au.checkTokenForDataBase, function(req, res) {
    admin.getSchools().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.delete('/school/:id', function(req, res) {
    var headerCity = req.headers["header-cityid"];
    admin.deleteSchoolOfDataBase(req.params.id, headerCity).then(function(result) {
        res.status(200).json({
            message: "Schools delete",
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_DELETE,
        });
    });
});

router.get('/school/:id', function(req, res) {
    var headerCity = req.headers["header-cityid"];
    admin.getNameSchool(req.params.id, headerCity).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.post('/school/:id', vl.validationFieldSchool, function(req, res) {
    var data = req.body;
    admin.updateSchool(data, req.params.id).then(function(result) {
        res.status(200).json("Update");
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});


module.exports = router;