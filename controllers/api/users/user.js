const path = require('path');

const {
    User
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    getUser: function(req, res, next) {
        console.log('getUser');

        const user_id = req.params.user_id;

        User.findByPk(user_id)
        .then(user => {
            res.json({
                user: user
            });
        }).catch(err => {
            console.error(err);
            
            res.json({
                error: err,
                where: 'getUser'
            });
        })
    },

    patchUser: function(req, res, next) {
        console.log('patchUser');

        const user_id = req.params.user_id;

        const login = req.query.login;
        const password = req.query.password;
        const fullName = req.query.fullName;
        const email = req.query.email;

        let options = {};
        if (login) {
            options.login = login;
        }
        if (password) {
            options.password = password;
        }
        if (fullName) {
            options.fullName = fullName;
        }
        if (email) {
            options.email = email;
        }

        User.findByPk(user_id)
        .then(user => {
            user.update(options)
            .then(updated => {
                res.json({
                    user: updated
                });
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'patchUser'
            });
        });
    },

    deleteUser: function(req, res, next) {
        console.log('deleteUser');

        const user_id = req.params.user_id;

        User.findByPk(user_id)
        .then(user => {
            user.destroy()
            .then(destroyed => {
                res.json({
                    user: destroyed
                });
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'deleteUser'
            });
        });
    },



    isUserExist: function(req, res, next) {
        const user_id = req.params.user_id;

        User.findByPk(user_id)
        .then(user => {
            if (user) {
                next();
            } else {
                res.json({
                    message: 'Користувача не знайдено'
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isUserExist'
            })
        })
    },

    isOwner: function(req, res, next) {
        const user_id = req.params.user_id;

        if (user_id == req.user.id) {
            next();
        } else {
            res.json({
                message: 'Лише власник профілю може зробити це'
            });
        }
    },

    isOwnerOrAdmin: function(req, res, next) {
        const user_id = req.params.user_id;

        if (user_id === req.user.id) {
            return next();
        }

        User.findByPk(req.user.id)
        .then(user => {
            if (user.role === 'admin') {
                next();
            } else {
                res.json({
                    message: 'Лише власник профілю або адміністратор може зробити це'
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isOwnerOrAdmin'
            });
        })
    }
}
