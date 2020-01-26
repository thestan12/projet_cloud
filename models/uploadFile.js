let connection = require('../config/db');

class uploadFile {

    static update(request, content, cb) {


      connection.query('INSERT INTO filesuser SET `fileName`=?, `userId`= ?, `date`= ?',
          [content.fileName, content.userId, content.date], (err, result) => {
              if (err) throw err;
              cb(result);
          });

    }

}

module.exports = uploadFile;
