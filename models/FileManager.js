let connection = require('../config/db');

FileManager = {

    findFiles: function(request, callback) {
        let id = request.session.user.id;

        connection.query('SELECT * FROM file WHERE userId=?',
            [id], function(err, result) {
            if(err) {
                throw err;
            }

            callback(JSON.parse(JSON.stringify(result)));
            });
    }
};


module.exports = FileManager;
