const express = require('express');
const router = express.Router();

const {
  
  indexCtr: {
    notAuthentificated,
  },

  authCtr: {

    register: {
      getRegister,
      postRegister,
      
      registrationDataValidate
    },

    login: {
      getLogin,
      postLogin
    },

    logout: {
      postLogout
    },

    passwordReset: {
      getPasswordReset,
      postPasswordReset,
      getPasswordUpdate,
      postPasswordUpdate
    }
  }
} = require('./index');

router.get('/register', notAuthentificated, getRegister);
router.post('/register', notAuthentificated, registrationDataValidate, postRegister, postLogin);

router.get('/login', notAuthentificated, getLogin);
router.post('/login', notAuthentificated, postLogin);

router.post('/logout', postLogout);

router.get('/password-reset', notAuthentificated, getPasswordReset);
router.post('/password-reset', notAuthentificated, postPasswordReset);
router.get('/password-reset/:confirm_token', notAuthentificated, getPasswordUpdate);
router.post('/password-reset/:confirm_token', notAuthentificated, postPasswordUpdate);

module.exports = router;
