const express = require('express');
const router = express.Router();

const path = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatars/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
});

const {

  indexCtr: {
    isAuthentificated,
    isAdmin,

    userDataValidate,
  },

  usersCtr: {
    
    user: {
      getUser,
      patchUser,
      deleteUser,

      isUserExist,
      isOwner,
      isOwnerOrAdmin
    },

    users: {
      getUsers,
      postUsers,
      patchAvatar
    }
  }
} = require('./index');

router.patch('/avatar', isAuthentificated, isOwnerOrAdmin, upload.single('avatar'), patchAvatar);

router.get('/:user_id', isUserExist, getUser);
router.patch('/:user_id', isUserExist, isAuthentificated, isOwner, userDataValidate, patchUser);
router.delete('/:user_id', isUserExist, isAuthentificated, isOwnerOrAdmin, deleteUser);

router.get('/', getUsers);
router.post('/', isAuthentificated, isAdmin, userDataValidate, postUsers);

module.exports = router;
