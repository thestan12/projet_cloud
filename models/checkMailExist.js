let connection = require('../config/db')

class checkMailExist {

    static checkMail(request, response, callback) {

          let email = request.body.email;
          connection.query("SELECT * FROM userclient WHERE email=?", [email], function (error, results, fields) {
              callback(request, response, error, results)
          })
      }

    }

module.exports = checkMailExist
