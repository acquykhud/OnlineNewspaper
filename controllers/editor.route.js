const express = require('express');
const moment = require('moment');

const auth = require('../middlewares/auth.mdw');

const articlesModel = require('../models/articles.model');
const tagsModel = require('../models/tags.model');

const router = express.Router();

router.get('/', auth.requireLogin, async function(req, res) {
    if (req.session.user.role !== 4) {
        res.render('editor/list_managed_post', {
            permitted: false
        });
    }

    const editor_id = req.session.user.id;
    const allArticles = await articlesModel.getEditorArticleList(editor_id);

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
            if (decline_info.editor_id === editor_id) {
                article.editor = "Bạn";
            } else {
                article.editor = decline_info.full_name;
            }
            article.reason = decline_info.decline_reason;
        } else if (article.state === 1 || article.state === 2) {
            const accept_info = await articlesModel.getEditorInfoAccepted(article.article_id);
            if (accept_info.editor_accepted === editor_id) {
                article.editor = "Bạn";
            } else {
                article.editor = accept_info.full_name;
            }
        }
    }

    res.render('editor/list_managed_post', {
        permitted: true,
        article_list: allArticles
    });
});

router.post('/send-declined-reason', auth.requireLogin, async function(req, res) {
    const editor_id = req.session.user.id;
    const article_id = req.body.declined_article_id;
    const declined_reason = req.body.declined_note;

    await articlesModel.setStateToDeclined(article_id);
    await articlesModel.addToDeclinedArticles(article_id, editor_id, declined_reason);

    res.redirect('/editor');
});

router.post('/send-accepted', auth.requireLogin, async function(req, res) {
    const editor_id = req.session.user.id;
    const article_id = req.body.accepted_article_id;
    const subcategory_id = req.body.subcategory_id;
    const tags = req.body.tags[1].split(',');
    const release_time = moment(req.body.release_time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');

    await articlesModel.updateAcceptedArticleFromEditor(article_id, editor_id, release_time);
    await articlesModel.updateSubcategoryForArticle(article_id, subcategory_id);
    await tagsModel.addTagList(tags);
    await articlesModel.updateTagsForArticle(article_id, tags);

    res.redirect('/editor');
});

module.exports = router;