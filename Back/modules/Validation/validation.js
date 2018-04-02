var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var ob = require('../Objecterror/objectError');

router.use(expressValidator());

router.post('/', function(req, res, next) {

    req.checkBody('name', ob.objERRORS.USER_NAME).notEmpty().isAlpha();
    req.checkBody('surname', ob.objERRORS.USER_SURNAME).notEmpty().isAlpha();
    req.checkBody('password', ob.objERRORS.USER_PASSWORD).notEmpty().isLength({
        min: 5
    });

    var errors = req.validationErrors();

    if (errors) {
        for (var i = 0; i < errors.length; i++) {
            res.status(400).json({
                message: errors[i].msg,
            });
            return;
        }
    } else {
        next();
    }
});

module.exports = router;