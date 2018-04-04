var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var admin = require('../Database/SqlQueryAdmin');
var au = require('../Authorization/Authorization');


router.get('/cities', function(req, res) {
    admin.getCities().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.post('/city', function(req, res) {
    var data = req.body;
    admin.insertNewCity(data).then(function(result) {
        res.status(200).json("ADD");
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.delete('/city/:id', function(req, res) {
    admin.deleteCityOfDataBase(req.params.id).then(function(result) {
        res.status(200).json({
            message: "City delete",
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_DELETE,
        });
    });
});

router.get('/city/:id', function(req, res) {
    admin.getNameCity(req.params.id).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.post('/city/:id', function(req, res) {
    var data = req.body;
    admin.updateCity(data, req.params.id).then(function(result) {
        res.status(200).json("Update");
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

module.exports = router;