const path = require('path');

const {
    User
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    getRegister: function (req, res, next) {
        console.log('getRegister');

        res.send('NOT IMPLEMENTED: getRegister');
    },

    postRegister: function (req, res, next) {
        console.log('postRegister');

        const login = req.query.login;
        const password = req.query.password;
        const fullName = req.query.password;
        const email = req.query.email;

        User.create({
            login: login,
            password: password,
            fullName: fullName,
            email: email
        }).then(user => {
            next();
        }).catch(err => 
            res.json({
                error: err,
                where: 'postRegister'
            })
        );
    },

    registrationDataValidate: function(req, res, next) {
        console.log('registrationDataValidate');

        const login = req.query.login;
        const password = req.query.password;
        const passwordConfirmation = req.query.passwordConfirmation;
        const email = req.query.email;

        User.findOne({
            where: {
                login: login
            },
            paranoid: false
        }).then(userWithLogin => {
            if (userWithLogin) {
                res.json({
                    message: 'Login is taken'
                });
            } else if (password !== passwordConfirmation) {
                res.json({
                    message: 'Passwords do not match'
                });
            } else {
                User.findOne({
                    where: {
                        email: email
                    }
                }).then(userWithEmail => {
                    if (userWithEmail) {
                        res.json({
                            message: 'Email is taken'
                        })
                    } else {
                        next();
                    }
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'registrationDataValidate'
            });
        });
    }
}
