const express = require('express');
const router = express.Router();

const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const postsRouter = require('./api/posts');
const categoriesRouter = require('./api/categories');
const commentsRouter = require('./api/comments');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/categories', categoriesRouter);
router.use('/comments', commentsRouter);

module.exports = router;
