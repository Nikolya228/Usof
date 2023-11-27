const path = require('path');

const {
    sequelize,
    Post,
    PostCategory,
    Category
} = require(path.join(process.env.APP_DIR, 'models/index'));

module.exports = {

    getPosts: function(req, res, next) {
        console,log('getPosts');

        let options;
        if (req.user && req.user.role !== 'admin') {
            options = {
                where: {
                    status: 'active'
                }
            };
        } else {
            options = {};
        }

        Post.findAll(options)
        .then(posts => {
            res.json({
                posts: posts
            });
        }).catch(err => {
            res.json({
                error: err,
                where: 'getPosts'
            });
        });
    },

    postPosts: function(req, res, next) {
        console.log('postPosts');

        const title = req.query.title;
        const content = req.query.content;
        const categoriesIds = req.categoriesIds;

        Post.create({
            author: req.user.id,
            title: title,
            content: content
        }).then(post => {
            categoriesIds.forEach(categoryId => {
                PostCategory.create({
                    CategoryId: categoryId,
                    PostId: post.id
                });
            });
            res.json({
                post: post
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postPosts'
            });
        });
    },



    postDataValidate: function(req, res, next) {
        console.log('postDataValidate');
        
        const title = req.query.title;
        const content = req.query.content;
        const categories = req.query.categories;

        if (title == null || title.length == 0) {
            res.json({
                message: 'Введіть валідний заголовок'
            });
        } else if (content == null || content.length == 0) {
            res.json({
                message: 'Контент не може буди порожнім'
            });
        } else if (categories == null || categories.length == 0) {
            res.json({
                message: 'Додайте хоча б одну категорію'
            });
        } else {
            next();
        }
    }
}
