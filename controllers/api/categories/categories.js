const path = require('path');

const {
    Category
} = require(path.join(process.env.APP_DIR, 'models/index'));

module.exports = {

    getCategories: function(req, res, next) {
        console.log('getCategories');

        Category.findAll()
        .then(categories => {
            res.json({
                categories: categories
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'getCategories'
            });
        })
    },

    postCategories: function(req, res, next) {
        console.log('postCategories');

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

        Category.create(options)
        .then(category => {
            res.json({
                category: category
            });
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postCategories'
            });
        });
    }
}
