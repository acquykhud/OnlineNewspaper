const express = require('express');
const moment = require('moment');

const articlesModel = require('../models/articles.model');
const tagsModel = require('../models/tags.model');

const router = express.Router();

// Bài viết của editor nào?
const editor_id = 2;
let logged = false;


// Cần thêm bảng accepted_articles?
router.get('/', async function(req, res) {
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
            console.log(article.editor);
        }
    }

    //console.log(allArticles);

    res.render('editor/list_managed_post', {
        logged: logged,
        article_list: allArticles
    });
});

router.post('/send-declined-reason', async function(req, res) {
    const article_id = req.body.declined_article_id
    const declined_reason = req.body.declined_note

    //console.log(article_id);
    //console.log(declined_reason);

    await articlesModel.setStateToDeclined(article_id);
    await articlesModel.addToDeclinedArticles(article_id, editor_id, declined_reason);

    res.redirect('/editor');
});

router.post('/send-accepted', async function(req, res) {
    const article_id = req.body.accepted_article_id;
    const subcategory_id = req.body.subcategory_id;
    const tags = req.body.tags[1].split(',');
    //const release_time_raw = req.body.release_time;
    const release_time = moment(req.body.release_time, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');

    // console.log(article_id);
    // console.log(subcategory_id);
    // console.log(tags);
    // console.log(release_time);

    await articlesModel.updateAcceptedArticleFromEditor(article_id, editor_id, release_time);
    for (tag_name of tags) {
        const isIncluded = await tagsModel.isIncluded(tag_name);
        if (isIncluded === false) {
            await tagsModel.add(tag_name);
        }
    }
    await articlesModel.updateSubcategoryForArticle(article_id, subcategory_id);
    await articlesModel.removeTagsOfArticle(article_id);
    for (tag_name of tags) {
        await articlesModel.addArticleTagRelationship(article_id, tag_name);
    }

    res.redirect('/editor');
});

module.exports = router;