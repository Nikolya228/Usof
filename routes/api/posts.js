const express = require('express');
const router = express.Router();

const {

  indexCtr: {
    isAuthentificated,

    postDataValidate,
    commentDataValidate,
    findOrCreateCategories
  },

  postsCtr: {
    
    post: {
      getPost,
      patchPost,
      deletePost,

      getPostComments,
      postPostComments,
      getPostCategories,
      getPostLike,
      postPostLike,
      deletePostLike,


      isPostExist,
      isOwner,
      isOwnerOrAdmin
    },
    
    posts: {
      getPosts,
      postPosts
    }
  }
} = require('./index');

router.get('/:post_id', isPostExist, getPost);
router.patch('/:post_id', isPostExist, isAuthentificated, isOwner, postDataValidate, findOrCreateCategories, patchPost);
router.delete('/:post_id', isPostExist, isAuthentificated, isOwnerOrAdmin, deletePost);

router.get('/:post_id/comments', isPostExist, getPostComments);
router.post('/:post_id/comments', isPostExist, isAuthentificated, commentDataValidate, postPostComments);
router.get('/:post_id/categories', isPostExist, getPostCategories);
router.get('/:post_id/like', isPostExist, getPostLike);
router.post('/:post_id/like', isPostExist, isAuthentificated, postPostLike);
router.delete('/:post_id/like', isPostExist, isAuthentificated, deletePostLike);

router.get('/', getPosts);
router.post('/', isAuthentificated, postDataValidate, findOrCreateCategories, postPosts);

module.exports = router;
