var express = require('express');
var router = express.Router();
var ob = require('../Objecterror/objectError');
var db = require('../Database/SqlQuery');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/', function(req, res, next) {
    var data = req.body;

    db.checkName(data).then(function(result) {
        if (result.length === 0) {
            return next();
        } else {
            res.status(409).json({
                message: ob.objERRORS.USER_CREATE,
            });
        }
    }).catch(function(error) {
        res.status(404).json({
            message: ob.objERRORS.USER_INFO,
        });
    });
});


module.exports = router;