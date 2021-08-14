const express = require('express');

const auth = require('../middlewares/auth.mdw');

const articlesModel = require('../models/articles.model');
const tagsModel = require('../models/tags.model');

const router = express.Router();

router.get('/', auth.requireLogin, async function(req, res) {
    if (req.session.user.role !== 3) {
        res.render('editor/list_managed_post', {
            permitted: false
        });
    }

    const author_id = req.session.user.id;
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
        } else {
            article.cat_subcat = 'undefined';
        }

        if (article.state === 3) {
            const decline_info = await articlesModel.getLatestDeclineReason(article.article_id);
            article.editor = decline_info.full_name;
            article.reason = decline_info.decline_reason;
        }
    }

    res.render('writer/list_own_post', {
        permitted: true,
        article_list: allArticles
    });
});

router.get('/edit/:id/', auth.requireLogin, async function(req, res) {
    const author_id = req.session.user.id;
    const article_id = req.params.id;

    let article = await articlesModel.getArticleForWriter(article_id);
    if (!((article.state === 3 || article.state === 4) && author_id === article.author_id)) {
        article = undefined;
    }
    res.render('writer/edit_post', {
        article: article,
        article_id: article_id
    });
});

router.post('/edit-post', auth.requireLogin, async function(req, res) {
    const article_id = req.body.article_id;
    const title = req.body.title;
    const subcategory_id = req.body.subcategory_id;
    const abstract = req.body.abstract;
    const content = req.body.content;
    const tags = req.body.tags[1].split(',');
    const avatar_path = req.body.avatar;

    await articlesModel.updateArticleFromWriter(article_id, title, abstract, content, avatar_path);
    await articlesModel.updateSubcategoryForArticle(article_id, subcategory_id);
    await tagsModel.addTagList(tags);
    await articlesModel.updateTagsForArticle(article_id, tags);
    res.redirect('/writer');
})

router.get('/new', auth.requireLogin, function(req, res) {
    let permitted = true;
    if (req.session.user.role !== 3) {
        permitted = false;
    }

    res.render('writer/new_post', {
        permitted: permitted
    });
});

router.post('/add-new-post', auth.requireLogin, async function(req, res) {
    const author_id = req.session.user.id;
    const title = req.body.title;
    const subcategory_id = req.body.subcategory_id;
    const abstract = req.body.abstract;
    const content = req.body.content;
    const tags = req.body.tags[1].split(',');
    const avatar_path = req.body.avatar;

    const addResult = await articlesModel.addArticleFromWriter(author_id, title, content, abstract, avatar_path);
    const article_id = addResult[0].insertId;
    await articlesModel.insertSubcategoryForArticle(article_id, subcategory_id);
    await tagsModel.addTagList(tags);
    await articlesModel.updateTagsForArticle(article_id, tags);
    res.redirect('/writer');
})

module.exports = router;