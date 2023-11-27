const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// config vars
const dotenv = require('dotenv');
dotenv.config();
process.env.APP_DIR = path.resolve('.');

const { sequelize, User } = require('./models/index')

const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// database setup
sequelize.sync({force: true}).then(() => {
  User.create({
      login: 'admin',
      password: 'admin',
      email: 'admin@admin.com',
      fullName: 'Admin Administrator',
      role: 'admin'
  });
});

// routers setup
app.use('/api', apiRouter);
// app.use('/', (req, res) => res.redirect('/api/auth/login'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// console.log(require('crypto').randomBytes(64).toString('hex'))
