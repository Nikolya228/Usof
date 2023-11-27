const path = require('path');

const {
    User
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    getUsers: function(req, res, next) {
        console.log('getUsers');

        User.findAll()
        .then(users => {
            res.json({
                users: users
            });
        }).catch(err => {
            res.json({
                error: err,
                where: 'getUsers'
            });
        });
    },

    postUsers: function(req, res, next) {
        console.log('postUsers');

        const login = req.query.login;
        const password = req.query.password;
        const email = req.query.email;
        const role = req.query.role;

        User.create({
            login: login,
            password: password,
            email: email,
            role: role
        }).then(user => {
            res.json({
                user: user
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postUsers'
            });
        })
    },

    patchAvatar: function(req, res, next) {
        console.log('patchAvatar');

        const { filename } = req.file;

        User.findByPk(req.user.id)
        .then(user => {
            user.update({
                avatar: filename
            }).then(updated => {
                res.json({
                    user: updated
                });
            });
        }).catch(err => {
            res.json({
                error: err,
                where: 'patchAvatar'
            });
        });
    }
}
