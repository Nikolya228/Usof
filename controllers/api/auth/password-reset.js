const path = require('path');

const {
    User,
    Token
} = require(path.join(process.env.APP_DIR, 'models/index'));

const randToken = require('rand-token');
const nodemailer = require('nodemailer');
const { query } = require('express');

function sendEmail(email, token) {
    console.log('sendEmail');

    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'usof@gmail.com',
            pass: 'password'
        }
    });
 
    const mailOptions = {
        from: 'usof@gmail.com',
        to: email,
        subject: 'Скидання паролю',
        html: '<p>Для скидання паролю клікніть <a href="http://localhost:3000/api/auth/reset-password/' + token  + '">тут</a>'
    };
 
    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error(error)
        } else {
            console.log(info)
        }
    });
}

module.exports = {

    getPasswordReset: function (req, res, next) {
        console.log('getPasswordReset');

        res.send('NOT IMPLEMENTED: getPasswordReset');
    },

    postPasswordReset: function (req, res, next) {
        console.log('postPasswordReset');

        const email = req.query.email;

        User.findOne({
            where: {
                email: email
            }
        }).then((user) => {
            if (user) {
                const resetToken = randToken.generate(20);

                Token.create({
                    user: user.id,
                    token: resetToken
                }).then(token => {
                    sendEmail(email, resetToken);
                    res.json({
                        user: user,
                        token: token
                    });
                }).catch(err => {
                    console.error(err);

                    res.json({
                        error: err,
                        where: 'postPasswordReset'
                    });
                })
            } else {
                res.json({
                    message: 'Користувача з цією поштою не знайдено'
                });
            }
        });
    },

    getPasswordUpdate: function (req, res, next) {
        console.log('getPasswordUpdate');

        res.send('NOT IMPLEMENTED: getPasswordUpdate');
    },

    postPasswordUpdate: function (req, res, next) {
        console.log('postPasswordUpdate');

        const resetToken = req.params.confirm_token;

        const password = req.query.password;
        const passwordConfirmation = req.query.passwordConfirmation;

        if (password !== passwordConfirmation) {
            return res.json({
                message: 'Паролі не співпадають'
            });
        }

        Token.findOne({
            where: {
                token: resetToken
            }
        }).then(token => {
            if (!token) {
                res.json({
                    message: 'Токен не знайдено'
                });
            } else {
                User.findByPk(token.user)
                .then(user => {
                    user.update({
                        password: password
                    }).then(updated => {
                        res.json({
                            user: updated
                        });
                    });
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postPasswordUpdate'
            });
        });
    }
}
