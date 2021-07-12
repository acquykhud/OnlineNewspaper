const express = require('express');

const categoriesModel = require('../models/categories.models');
const articlesModel = require('../models/articles.model');

const router = express.Router();

router.get('/get-category-list', async function(req, res) {
    const categoryList = await categoriesModel.getListOfCategories();

    //console.log(categoryList);

    res.json(categoryList);
});

// '/get-subcategory-list?catid=""
router.get('/get-subcategory-list', async function(req, res) {
    const categoryId = +req.query.catid;
    const subcategoryList = await categoriesModel.getListOfSubCategories(categoryId);

    //console.log(subcategoryList);

    res.json(subcategoryList);
});

// '/get-tag-list?artid=""
router.get('/get-tag-list', async function(req, res) {
    const article_id = +req.query.artid;
    const return_db = await articlesModel.getTagForArticle(article_id);
    const tagList = [];
    for (const record of return_db) {
        tagList.push(record.tag_name);
    }
    //const tagStr = tagList.join(',');
    //console.log(tagStr);
    res.json(tagList);
});

module.exports = router;