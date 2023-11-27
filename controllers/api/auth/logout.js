const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    User
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    postLogout: async function (req, res, next) {
        console.log('postLogout');

        res.clearCookie('token');

        res.json({
            message: 'Ви вийшли з системи'
        });
    }
}
