let connection = require('../config/db')


class checkMdp {

    static check(request, response, callback) {
        let email = request.session.email;
        connection.query("SELECT * FROM userclient WHERE email=?", [email], function (error, results, fields) {
            callback(request, response, error, results);
        });
    }
}

module.exports = checkMdp;
