const express = require('express');

const articlesModel = require('../models/articles.model');

const router = express.Router();

// Bai viet cua writer nao?
let logged = false;
let author_id = 3;

router.get('/', async function(req, res) {
    const allArticles = await articlesModel.getArticleList(author_id);

    for (const article of allArticles) {
        const tagnames = await articlesModel.getTagForArticle(article.article_id);
        article.tagnames = [];
        for (const name of tagnames) {
            article.tagnames.push(name.tag_name);
        }

        const cat_subcat = await articlesModel.getCategoryForArticle(article.article_id);
        if (cat_subcat !== undefined) {
            article.cat_subcat = `${cat_subcat.category_name} > ${cat_subcat.subcategory_name}`
        }

        if (article.state === 3) {
            const decline_info = await articlesModel.getLatestDeclineReason(article.article_id);
            article.editor = decline_info.full_name;
            article.reason = decline_info.decline_reason;
        }
    }

    //console.log(allArticles);

    res.render('writer/list_own_post', {
        logged: logged,
        article_list: allArticles
    });
});

router.get('/edit/1', function(req, res) {
    res.render('writer/edit_post', { logged: logged });
});

router.get('/new', function(req, res) {
    res.render('writer/edit_post', { logged: logged });
});

module.exports = router;