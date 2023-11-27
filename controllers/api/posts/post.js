const path = require('path');

const {
    User,
    Post,
    PostCategory,
    Category,
    Comment,
    Like
} = require(path.join(process.env.APP_DIR, 'models/index'));

module.exports = {

    getPost: function(req, res, next) {
        console.log('getPost');

        const post = req.post;

        if (post.status === 'active'
        || req.user && req.user.role === 'admin') {
            res.json({
                post: post
            });
        } else {
            res.json('Пост не знайдено');
        }
    },

    patchPost: function(req, res, next) {
        console.log('patchPost');

        const post = req.post;

        const title = req.query.title;
        const content = req.query.content;
        const categoriesIds = req.categoriesIds;

        post.update({
            title: title,
            content: content
        }).then(updated => {
            updated.setPostCategory(categoriesIds);
            res.json({
                post: updated
            });
        }).catch(err => {
            res.json({
                error: err,
                where: 'patchPost'
            });
        })
    },

    deletePost: function(req, res, next) {
        console.log('deletePost');

        const post = req.post;

        post.destroy()
        .then(destroyed => {
            res.json({
                post: destroyed
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'deletePost'
            });
        });
    },


    getPostComments: function(req, res, next) {
        console.log('getPostComments');

        const post = req.post;

        post.getComments()
        .then(comments => {
            res.json({
                comments: comments
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'getPostComments'
            });
        });
    },

    postPostComments: function(req, res, next) {
        console.log('postPostComments');

        const user = req.user;
        const post = req.post;
        const content = req.query.content;

        Comment.create({
            author: user.id,
            post: post.id,
            content: content
        }).then(comment => {
            res.json({
                comment: comment
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postPostComments'
            });
        });
    },

    getPostCategories: function(req, res, next) {
        console.log('getPostCategories');

        const post = req.post;

        post.getPostCategory()
        .then(categories => {
            res.json({
                categories: categories
            });
        }).catch(err => {
            res.json({
                error: err,
                where: 'getPostCategories'
            });
        });
    },

    getPostLike: async function(req, res, next) {
        console.log('getPostLike');

        const post = req.post;

        let likes = await Like.count({
            where: {
                entity: 'post',
                entityId: post.id,
                type: 'like'
            }
        }) - await Like.count({
            where: {
                entity: 'post',
                entityId: post.id,
                type: 'dislike'
            }
        });

        res.json({
            likes: likes
        });
    },

    postPostLike: function(req, res, next) {
        console.log('postPostLike');

        const post = req.post;
        const user = req.user;

        Like.findOrCreate({
            where: {
                author: user.id,
                entity: 'post',
                entityId: post.id
            }
        }).then(like => {
            res.json({
                like: like
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postPostLike'
            });
        })
    },

    deletePostLike: function(req, res, next) {
        console.log('deletePostLike');

        const user = req.user;
        const post = req.post;

        Like.findByPk({
            author: user.id,
            entity: 'post',
            entityId: post.id
        }).then(like => {
            if (like) {
                like.destroy()
                .then(destroyed => {
                    res.json({
                        like: destroyed
                    });
                });
            } else {
                res.json({
                    message: 'Вподобайку не знайдено'
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'deletePostLike'
            });
        });
    },



    isPostExist: function(req, res, next) {
        console.log('isPostExist');

        const post_id = req.params.post_id;

        Post.findByPk(post_id)
        .then(post => {
            if (!post) {
                res.json({
                    message: 'Пост не знайдено'
                });
            } else {
                req.post = post;
                next();
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isPostExist'
            });
        });
    },

    isOwner: function(req, res, next) {
        console.log('isOwner');
        const post_id = req.params.post_id;

        Post.findByPk(post_id)
        .then(post => {
            if (post.author !== req.user.id) {
                res.json({
                    message: 'Лише автор посту може зробити це'
                });
            } else {
                next();
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isOwner'
            });
        });
    },

    isOwnerOrAdmin: function(req, res, next) {
        console.log('isOwnerOrAdmin');

        const post_id = req.params.post_id;

        if (req.user.role === 'admin') {
            return next();
        }

        Post.findByPk(post_id)
        .then(post => {
            if (post.author !== req.user.id) {
                res.json({
                    message: 'Лише автор посту або адміністратор може зробити це'
                });
            } else {
                next();
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isOwnerOrAdmin'
            });
        });
    }
}
