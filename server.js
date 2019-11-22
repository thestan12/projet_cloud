//Les modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const formidable = require('formidable');

//pour la la récupération de mot de passe
const passport = require('passport');
const nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const async = require('async');
const crypto = require('crypto');

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
app.use(require('./middlewares/redirector'));

// middleware calculant les nombres des messages et notification non lus


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
                    user: '!!! YOUR SENDGRID USERNAME !!!',
                    pass: '!!! YOUR SENDGRID PASSWORD !!!'
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
            flashDataBase.create(request.body, function () {
                request.flash('info', 'Compte crée avec succés');
                response.redirect('/login');

            });
        }
        else {
            request.flash('info', 'adresse mail existe déjà !');
            response.redirect('/login');
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
    })
});
let server = app.listen(8000);
