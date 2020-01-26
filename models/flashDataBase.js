let connection = require('../config/db');

class flashDataBase {

    static create(content, cb) {

        connection.query('INSERT INTO userclient SET last_name= ?, email=?, password=?',
            [content.prenom, content.email, content.psw], (err, result) => {

                if (err) throw err;
                cb(result);
            });

    }


    static all(content, cb) {
        connection.query("SELECT * FROM userclient where email=?",content.email, (err, rows) => {
            if (err) throw err;
            cb(err,rows);

        })

    }
}

module.exports = flashDataBase;
