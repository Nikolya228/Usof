const path = require('path');

const apiControllers = path.join(process.env.APP_DIR, 'controllers/api');

const authControllers = path.join(apiControllers, 'auth');
const usersControllers = path.join(apiControllers, 'users');
const postsControllers = path.join(apiControllers, 'posts');
const categoriesControllers = path.join(apiControllers, 'categories');
const commentsControllers = path.join(apiControllers, 'comments');

// index
const indexCtr = require(path.join(apiControllers, 'index'));

// auth module
const register = require(path.join(authControllers, 'register'));
const login = require(path.join(authControllers, 'login'));
const logout = require(path.join(authControllers, 'logout'));
const passwordReset = require(path.join(authControllers, 'password-reset'));

// users module
const user = require(path.join(usersControllers, 'user'));
const users = require(path.join(usersControllers, 'users'));

// posts module
const post = require(path.join(postsControllers, 'post'));
const posts = require(path.join(postsControllers, 'posts'));

// categories module
const category = require(path.join(categoriesControllers, 'category'));
const categories = require(path.join(categoriesControllers, 'categories'));


// comments module
const comment = require(path.join(commentsControllers, 'comment'));

// exports
const authCtr = { register: register, login: login, logout: logout, passwordReset: passwordReset };
const usersCtr = { user: user, users: users };
const postsCtr = { post: post, posts: posts };
const categoriesCtr = { category: category, categories: categories };
const commentsCtr = { comment: comment };

module.exports = {
    indexCtr,
    authCtr,
    usersCtr,
    postsCtr,
    categoriesCtr,
    commentsCtr
}
