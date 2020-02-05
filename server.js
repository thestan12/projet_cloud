//Les modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const formidable = require('formidable');

//pour la la récupération de mot de passe
const passport = require('passport');
const nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const async = require('async');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const open = require('open');
//Moteur de template
app.set('view engine', 'ejs');

//Midleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: ' keyboard cat pour chiffre les cookies',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
//pour les messages flash
app.use(require('./middlewares/flash'));

//pour les redirections de sécurité, lorsque le serveur subit un modification
//alors redirection automatique vers la page de login


//les gets
app.get('/', (request, response) => {
    response.render('CloudX', {test: ''})
});

app.get('/login', (request, response) => {
    response.render('login', {})
});
app.get('/accueil', (request, response) => {
    response.render('accueil', {test: ''})
});
app.get('/passwordUpdate', (request, response) => {
    response.render('passwordUpdate');
})
app.get('/resetMdp', (request, response) => {
    response.render('resetMdp');
});

app.get('/settings', (req, res) => {
    res.render('settings', {})
});

app.get('/email-update', (req, res) => {
    res.render('email-update', {})
});

app.get('/logout', (req, res) => {
    req.session.email = undefined
    res.redirect('/')
});

//pour restaurer le mot de passe
app.post('/resetMdp', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            let flashDataBase = require("./models/flashDataBase")
            flashDataBase.all(req.body, function (err, user) {
                if (user.length === 0) {
                    req.flash('flash', 'aucun compte est associer avec cette adresse mail.');
                     res.redirect('/resetMdp');
                }
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: 'userName',
                    pass: 'password'
                }
            });


            var mailOptions = {
                to: user[0].email,
                from: 'cloudXSupportTeam@gmail.com',
                subject: 'CloudXMe Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {

                //req.flash('info', 'An e-mail has been sent to ' + user[0].email + ' with further instructions.');
                done(err, 'done');
                return res.redirect('/login');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/resetMdp');
    });
});
//pour gérer les donnees de l'inscription transmis de page d'acceuil
app.post('/', (request, response) => {
    let flashDataBase = require("./models/flashDataBase")
    flashDataBase.all(request.body, function (err, result) {
        if (result.length === 0) {
            bcrypt.hash(request.body.psw, saltRounds, function (err, hash) {
              let data = {
                prenom: request.body.prenom,
                email: request.body.email,
                psw: hash
              };
              flashDataBase.create(data, function () {
                request.flash('info', 'Compte crée avec succés');
                response.redirect('/login');

              });
            });
        }
        else {
            request.flash('info', 'adresse mail existe déjà !');
            response.redirect('/login');
        }

    });
});
app.post('/login', async (request, response) => {
  let fetchID = require("./models/fetchID")
fetchID.check(request, response, function (request, response, err, result) {
    if (err) {
        throw err
    }
    else {
        if (result.length > 0) {
            bcrypt.compare(request.body.psw, result[0].password, function (err, res) {
              if (res == true) {
                request.session.email = request.body.email;
                request.session.password = request.body.psw;
                request.session.user = result[0];
                const user = result[0];
                let token = jwt.sign({ user }, 'secretkey' , { expiresIn: '1 days'});
                response.cookie('auth', token);
                request.session.token = token;
                console.log('acess token =', token);
                response.redirect('/accueil');
              } else {
                  request.flash('info', err ? 'Erreur interne est survenue!' : 'Adresse email ou mot de passe ne correspondent pas!')
                  response.redirect('/login')
                  return
              }
            })
        }
        else {
            request.flash('info', err ? 'Erreur interne est survenue!' : "Adresse email n'existe pas !")
            response.redirect('/login')
            return
        }

    }
  });
});
//pour modifier le mot de passe
app.post('/passwordUpdate', (request, response) => {
    let checkMdp = require("./models/checkMdp")
    checkMdp.check(request, response, function (request, response, err, result) {
        if (err) {
            throw err
        }
        else {
            if (result[0].password == request.body.pswActuelle) {
                let changeMdp = require("./models/changeMdp")
                changeMdp.creat(request, request.body, function () {
                    request.flash('info', 'Mot de passe à été changé avec succées')
                    response.redirect('/settings');
                    return
                })
            }

            else {
                request.flash('info', err ? 'Erreur interne est survenue!' : 'Votre mot de passe est incorrect.!')
                response.redirect('/passwordUpdate')
                return
            }
        }
    })
});

app.get('/find-all-files', verifyToken, (req,res) => {
  jwt.verify(req.token, 'secretkey', {expiresIn: '600s'}, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let FileManager = require('./models/FileManager');
      FileManager.findAllFiles(req, function (result) {
        res.json({
          message: result,
          authData
        });
      });
    }
  });
});

app.get('/all-users', (request, response) => {
  let flashDataBase = require("./models/flashDataBase")
  flashDataBase.all({}, function (err, user) {
      response.json(result);
  });
});


app.get('/token', function(request, response) {
  console.log('token =', request.session.token);
  response.json(request.session.token);
})

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        //  Forbidden
        res.sendStatus(403);
    }
}
//pour verifier le saisie de l'utilisateur dans la page de login ainsi pour la redirection vers la page d'accueil
app.post('/login', (request, response) => {
  let fetchID = require("./models/fetchID")
fetchID.check(request, response, function (request, response, err, result) {
    if (err) {
        throw err
    }
    else {
        if (result.length > 0) {
            if (result[0].password == request.body.psw) {
                request.session.email = request.body.email;
                request.session.password = request.body.psw;
                request.session.user = result[0];
                const user = result[0];
                jwt.sign({user}, 'secretkey', (err, token) => {
                    response.json({
                        token
                    })
                })
                response.redirect('/accueil');
            }
            else {
                request.flash('info', err ? 'Erreur interne est survenue!' : 'Adresse email ou mot de passe ne correspondent pas!')
                response.redirect('/login')
                return
            }
        }
        else {
            request.flash('info', err ? 'Erreur interne est survenue!' : "Adresse email n'existe pas !")
            response.redirect('/login')
            return
        }

    }
});
});
app.get('/files', (request, response) => {
    let FileManager = require('./models/FileManager');
    FileManager.findFiles(request, function (result) {
      console.log('result =', result);
        response.json(result);
    });
});

app.post('/delete-file', async function (request, response)  {
  let FileManager = require('./models/FileManager');
  FileManager.deleteFile(request, function (result) {
    console.log('result = ', result);
  });
  await executeDelete(request.session.user.id+'-'+request.session.user.last_name, request.session.user.id+'_'+request.body.fileName.fileName);
});

//if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path:'./.env'});
//}
const path = require('path');
const storage = require('azure-storage');
const blobService = storage.createBlobService();

//file upload
app.post('/file-upload', (request, response) => {
  let form = new formidable.IncomingForm()
  form.parse(request, async function (err, fields, files) {
    let UploadFile = require('./models/uploadFile')
      let file = files.filetoupload;
      let idUser = (request.session.user && request.session.user.id) ? request.session.user.id : 1;
      let fileUploaded = idUser + '_' + file.name;
      if (file.size != 0) {
          fs.renameSync(file.path, 'D:\\local\\Temp\\' + fileUploaded, function (err) {
              if (err) {
                  throw err
              }
          });
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
          await executeUpload('D:\\local\\Temp\\'+fileUploaded, request.session.user.id+'-'+request.session.user.last_name);
          const url = blobService.getUrl(request.session.user.id+'-'+request.session.user.last_name, request.session.user.id+'_'+file.name);
          let content = {
            fileName: file.name,
            userId: request.session.user.id,
            date: dateTime,
            url: url
          }
          UploadFile.update(request, content, function () {
            console.log('fileName is added to the dataBase');
          });
      }
  });
  response.redirect('/accueil');
});

const uploadLocalFile = async (containerName, filePath) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = path.basename(filePath);
        blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Local file "${filePath}" is uploaded` });
            }
        });
    });
};

const listContainers = async () => {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} containers`, containers: data.entries });
            }
        });
    });
};

const createContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};

const downloadBlob = async (containerName, blobName) => {
    const dowloadFilePath = path.resolve(blobName);
    return new Promise((resolve, reject) => {
        blobService.getBlobToStream(containerName, blobName, fs.createWriteStream(dowloadFilePath), (err, data) => {
            if (err) {
              console.log('error =', err);
                reject(err);
            } else {
                resolve({ message: `Blob downloaded "${data}"`, text: data });
            }
        });
    });
};

const deleteBlob = async (containerName, blobName) => {
    return new Promise((resolve, reject) => {
        blobService.deleteBlobIfExists(containerName, blobName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};


async function executeDelete(containerName, fileName) {
  console.log('trying to delete * ', fileName, ' * from container ', containerName);
  let response;
  response = await deleteBlob(containerName, fileName);
  console.log(response.message);
}

async function executeUpload(file, containerName) {
    console.log('trying to upload * ', file, ' * to container ', containerName);
    let response;
    response = await listContainers();
    const containerDoesNotExist = response.containers.findIndex((container) => container.name === containerName) === -1;

    if (containerDoesNotExist) {
        await createContainer(containerName);
        console.log(`Container "${containerName}" is created`);
    }
    response = await uploadLocalFile(containerName, file);
    console.log(response.message);
}

async function executeDownload(containerName, fileName) {
  console.log('trying to download * ', fileName, ' * from container ', containerName);
  response = await listContainers();
  console.log('container =', response);
  response = await downloadBlob(containerName, fileName);
  console.log(`Downloaded blob content: ${response}"`);
}

const port = process.env.port || 3000;
let server = app.listen(port, () => console.log('Server started on port ', port));

// DANS TERRAFORM IL FAUT CREER UN APPsERVICE
