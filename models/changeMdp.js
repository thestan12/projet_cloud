let connection = require('../config/db');

class changeMdp {

    static creat(request, content, cb) {

        connection.query('UPDATE userclient SET `password`=? WHERE email=?',
            [content.pswNouv, request.session.email], (err, result) => {

                if (err) throw err;
                cb(result);
            });

    }

}

module.exports = changeMdp;