let connection = require('../config/db');

FileManager = {

    findFiles: function(request, callback) {
        let id = request.session.user.id;

        connection.query('SELECT * FROM filesuser WHERE userId=?',
            [id], function(err, result) {
            if(err) {
                throw err;
            }

            callback(JSON.parse(JSON.stringify(result)));
            });
    },

    deleteFile: function(request, callback) {
        let id = request.session.user.id;
        let name = request.body.fileName.fileName;

        connection.query('DELETE FROM filesuser WHERE userId=? and fileName=?',
            [id, name], function(err, result) {
            if(err) {
                throw err;
            }
            callback(JSON.parse(JSON.stringify(result)));
            });
    }
};


module.exports = FileManager;
