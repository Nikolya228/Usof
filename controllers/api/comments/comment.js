const path = require('path');

const {
    Comment,
    Like
} = require(
    path.join(process.env.APP_DIR, 'models/index')
);

module.exports = {

    getComment: function(req, res, next) {
        console.log('getComment');

        const comment = req.comment;

        res.json({
            comment: comment
        });
    },

    patchComment: function(req, res, next) {
        console.log('patchComment');

        const comment = req.comment;
        const content = req.content;

        comment.update({
            content: content
        }).then(updated => {
            res.json({
                comment: updated
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'patchComment'
            });
        });
    },

    deleteComment: function(req, res, next) {
        console.log('deleteComment');

        const comment = req.comment;

        comment.destroy()
        .then(destroyed => {
            res.json({
                comment: destroyed
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'deleteComment'
            });
        });
    },


    getCommentLike: async function(req, res, next) {
        console.log('getCommentLike');

        const comment = req.comment;

        let likes = await Like.count({
            where: {
                entity: 'comment',
                entityId: comment.id,
                type: 'like'
            }
        }) - await Like.count({
            where: {
                entity: 'comment',
                entityId: comment.id,
                type: 'dislike'
            }
        });

        res.json({
            likes: likes
        });
    },

    postCommentLike: function(req, res, next) {
        console.log('postCommentLike');

        const user = req.user;
        const comment = req.comment;

        Like.findOrCreate({
            where: {
                author: user.id,
                entity: 'comment',
                entityId: comment.id
            }
        }).then(like => {
            res.json({
                like: like
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postCommentLike'
            });
        });
    },

    deleteCommentLike: function(req, res, next) {
        console.log('deleteCommentLike');

        const user = req.user;
        const comment = req.comment;

        Like.findByPk({
            author: user.id,
            entity: 'comment',
            entityId: comment.id
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
                where: 'deleteCommentLike'
            });
        });
    },



    isCommentExist: function(req, res, next) {
        console.log('isCommentExist');

        const comment_id = req.params.comment_id;

        Comment.findByPk(comment_id)
        .then(comment => {
            if (!comment) {
                res.json({
                    message: 'Коментар не знайдено'
                });
            } else {
                req.comment = comment;
                next();
            }
        }).catch(err => {
            res.json({
                error: err,
                where: 'isCommentExist'
            });
        });
    },

    isOwner: function(req, res, next) {
        console.log('isOwner');

        if (req.comment.author !== req.user.id) {
            res.json({
                message: 'Лише автор коментаря може зробити це'
            });
        } else {
            next();
        }
    },

    isOwnerOrAdmin: function(req, res, next) {
        console.log('isOwnerOrAdmin');

        if (req.user.role === 'admin') {
            next();
        } else if (req.comment.author !== req.user.id) {
            res.json({
                message: 'Лише автор коментаря або адміністратор може зробити це'
            });
        } else {
            next();
        }
    },
}
