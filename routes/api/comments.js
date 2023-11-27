const express = require('express');
const router = express.Router();

const {
  indexCtr: {
    isAuthentificated,

    commentDataValidate
  },

  commentsCtr: {

    comment: {
      getComment,
      patchComment,
      deleteComment,

      getCommentLike,
      postCommentLike,
      deleteCommentLike,


      isCommentExist,
      isOwner,
      isOwnerOrAdmin
    }
  }
} = require('./index');

router.get('/:comment_id', isCommentExist, getComment);
router.patch('/:comment_id', isCommentExist, isAuthentificated, isOwner, commentDataValidate, patchComment);
router.patch('/:comment_id', isCommentExist, isAuthentificated, isOwnerOrAdmin, deleteComment);

router.get('/:comment_id/like', isCommentExist, getCommentLike);
router.post('/:comment_id/like', isCommentExist, isAuthentificated, postCommentLike);
router.delete('/:comment_id/like', isCommentExist, isAuthentificated, deleteCommentLike);

module.exports = router;
