var user = require('../Database/SqlQuery');


exports.getRole = function getRole() {
        var roles = {};
  return user.selectRole().then(function(result) {

        roles.admin = result[0].id;
        roles.user = result[1].id;
        roles.guest = result[2].id;
       return roles;
    }).catch(function(error) {
        res.status(406).json({
            message: ob.objERRORS.USER_UPDATE,
        });
    });
}