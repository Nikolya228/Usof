const path = require('path');

const {
    Category
} = require(path.join(process.env.APP_DIR, 'models/index'));

module.exports = {
    getCategory: function(req, res, next) {
        console.log('getCategory');

        const category = req.category;

        res.json({
            category: category
        });
    },

    getCategoryPosts: function(req, res, next) {
        console.log('getCategoryPosts');
        
        const category = req.category;

        category.getPosts()
        .then(posts => {
            res.json({
                posts: posts
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'getCategoryPosts'
            });
        });
    },

    patchCategory: function(req, res, next) {
        console.log('patchCategory');

        const category = req.category;

        const title = req.query.title;
        const description = req.query.description;

        let options;
        if (description) {
            options = {
                title: title,
                description: description
            };
        } else {
            options = {
                title: title
            };
        }

        category.update(options)
        .then(updated => {
            res.json({
                category: updated
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'patchCategory'
            });
        });
    },

    deleteCategory: function(req, res, next) {
        console.log('deleteCategory');

        const category = req.category;

        category.destroy()
        .then(destroyed => {
            res.json({
                category: destroyed
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'deleteCategory'
            });
        });
    },


    isCategoryExist: function(req, res, next) {
        const category_id = req.params.category_id;

        Category.findByPk(category_id)
        .then(category => {
            if (!category) {
                res.json({
                    message: 'Категорію не знайдено'
                });
            } else {
                req.category = category;
                next();
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isCategoryExist'
            });
        });
    }
}
