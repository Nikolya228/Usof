const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    User
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    getLogin: function (req, res, next) {
        console.log('getLogin');

        res.send('NOT IMPLEMENTED: getLogin');
    },

    postLogin: async function (req, res, next) {
        console.log('postLogin');

        const login = req.query.login;
        const password = req.query.password;

        const user = await User.findOne({
            where: {
                login: login
            }
        });

        if (!user) {
            return res.json({
                message: 'Користувача не знайдено'
            });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.json({
                message: 'Неправильний пароль'
            });
        }

        const token = jwt.sign({
            id: user.id,
            login: user.login,
            role: user.role
        }, process.env.TOKEN_SECRET, {
            expiresIn: '30d'
        });

        if (token == null) {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
        
            req.user = user;
            res.cookie('token', token, {
                httpOnly: true,
                secure: true
            });

            res.redirect(`/api/users/${user.id}`);
        });
    }
}
