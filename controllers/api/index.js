const path = require('path');
const jwt = require('jsonwebtoken');

const {
    User,
    Category
} = require(path.join(process.env.APP_DIR, 'models/index'));

module.exports = {
    isAuthentificated: function(req, res, next) {
        console.log('isAuthentificated');

        const token = req.cookies.token;

        if (!token) {
            console.error('Токен відсутній');

            return res.redirect('/api/auth/login');
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            
            if (err) {
                console.error('Помилка перевірки токена: ', err.message);
                
                return res.redirect('/api/auth/login');
            }

            req.user = user;
            next();
        });
    },

    notAuthentificated: function(req, res, next) {
        console.log('notAuthentificated');

        if (!req.user) {
            next();
        } else {
            res.redirect(`/api/users/${req.user.id}`);
        }
    },

    isAdmin: function(req, res, next) {
        console.log('isAdmin');

        User.findByPk(req.user.id)
        .then(user => {
            if (user.role === 'admin') {
                next();
            } else {
                res.json({
                    message: 'Ви не можете цього зробити'
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'isAdmin'
            });
        })
    },



    userDataValidate: function(req, res, next) {
        console.log('userDataValidate');

        const login = req.query.login;
        const password = req.query.password;
        const passwordConfirmation = req.query.passwordConfirmation;
        const email = req.query.email;

        User.findOne({
            where: {
                login: login
            },
            paranoid: false
        }).then(userWithLogin => {
            if (userWithLogin && userWithLogin.id != req.user.id) {
                res.json({
                    message: 'Цей логін зайнятий'
                });
            } else if (password !== passwordConfirmation && userWithLogin.id != req.user.id) {
                res.json({
                    message: 'Паролі не співпадають'
                });
            } else {
                User.findOne({
                    where: {
                        email: email
                    }
                }).then(userWithEmail => {
                    if (userWithEmail && userWithLogin.id != req.user.id) {
                        res.json({
                            message: 'Ця пошта вже використовується'
                        });
                    } else {
                        next();
                    }
                });
            }
        }).catch(err => {
            console.error(err);

            res.json({
                error: err,
                where: 'postDataValidate'
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
    },

    commentDataValidate: function(req, res, next) {
        console.log('commentDataValidate');

        const content = req.query.content;

        if (content == null || content.length == 0) {
            res.json({
                message: 'Текст коментаря не може бути порожнім'
            });
        } else {
            next();
        }
    },

    categoryDataValidate: function(req, res, next) {
        console.log('categoryDataValidate');

        const title = req.query.title;
        const description = req.query.description;

        if (!title || title.length == 0) {
            res.json({
                message: 'Введіть вадідний заголовок'
            });
        } else {
            Category.findOne({
                where: {
                    title: title
                }
            }).then(category => {
                if (category) {
                    res.json({
                        message: 'Категорія з такою назвою вже існує'
                    });
                } else {
                    next();
                }
            }).catch(err => {
                console.error(err);

                res.json({
                    error: err,
                    where: 'categoryDataValidate'
                })
            });
        }
    },

    findOrCreateCategories: async function(req, res, next) {
        console.log('findOrCreateCategories');

        const categoriesTitles = Array.isArray(req.query.categories)
        ? req.query.categories
        : [req.query.categories];
      
        try {
            const categoriesIds = await Promise.all(
                categoriesTitles.map(async categoryTitle => {
                    const [category, created] = await Category.findOrCreate({
                        where: {
                            title: categoryTitle
                        }
                    });
      
                    return category.id;
                })
            );
      
            req.categoriesIds = categoriesIds;
            next();
        } catch (err) {
            console.error(err);
            
            res.json({
                error: err,
                where: 'findOrCreateCategories',
            });
        }
    }

    // findOrCreateCategories: function(req, res, next) {
    //     const categoriesTitles = req.query.categories;

    //     categoriesIds = [];
    //     categoriesTitles.forEach(categoryTitle => {
    //         Category.create({
    //             title: categoryTitle
    //         }).then(category => {
    //             categoriesIds.push(category.id);
    //         }).catch(err => {
    //             console.error(err);

    //             return res.json({
    //                 error: err,
    //                 where: 'findOrCreateCategories'
    //             });
    //         });
    //     });

    //     req.categoriesIds = categoriesIds;
    //     next();
    // }
}
