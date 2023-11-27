const express = require('express');
const router = express.Router();

const {
  
  indexCtr: {
    isAuthentificated,
    isAdmin
  },

  categoriesCtr: {

    category: {
      getCategory,
      getCategoryPosts,
      patchCategory,
      deleteCategory,

      isCategoryExist
    },

    categories: {
      getCategories,
      postCategories
    }
  }
} = require('./index');

router.get('/:category_id', isCategoryExist, getCategory);
router.get('/:category_id', isCategoryExist, getCategoryPosts);
router.patch('/:category_id', isCategoryExist, isAuthentificated, isAdmin, patchCategory);
router.delete('/:category_id', isCategoryExist, isAuthentificated, isAdmin, deleteCategory);

router.get('/', getCategories);
router.post('/', isAuthentificated, isAdmin, postCategories);

module.exports = router;
