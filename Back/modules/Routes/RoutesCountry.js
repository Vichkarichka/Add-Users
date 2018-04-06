var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var admin = require('../Database/SqlQueryAdmin');
var au = require('../Authorization/Authorization');
var vl = require('../Validation/validation');
var uniq = require('../Authorization/Uniq');
var user = require('../Database/SqlQuery');


router.get('/country/:id', function(req, res) {
    admin.getNameCountry(req.params.id).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});
router.get('/country', au.checkTokenForDataBase, function(req, res) {
    user.getContries().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
});

router.get('/countries', function(req, res) {
    user.getContries().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
});

router.post('/country', vl.validationFieldCountry, uniq.checkContryForDataBase, function(req, res) {
    var data = req.body;
    admin.insertNewCountry(data).then(function(result) {
        res.status(200).json("ADD");
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.post('/country/:id', vl.validationFieldCountry, uniq.checkContryForDataBase, function(req, res) {
    var data = req.body;
    admin.updateCountry(data, req.params.id).then(function(result) {
        res.status(200).json("Update");
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});

router.delete('/country/:id', function(req, res) {
    admin.deleteCountryOfDataBase(req.params.id).then(function(result) {
        res.status(200).json({
            message: "Country delete",
        });
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_DELETE,
        });
    });
});

module.exports = router;