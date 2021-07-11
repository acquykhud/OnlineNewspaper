const express = require('express');

const articlesModel = require('../models/articles.model');

const router = express.Router();

// Bài viết của editor nào?
const editor_id = 2;
let logged = false;

// Chưa truy xuất editor nào duyệt bài nào
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
        }
    }

    //console.log(allArticles);

    res.render('editor/list_managed_post', {
        logged: logged,
        article_list: allArticles
    });
});

//Chưa xử lý declined_note trống tại client-side
router.post('/send-declined-reason', async function(req, res) {
    const article_id = req.body.declined_article_id
    const declined_reason = req.body.declined_note

    //console.log(article_id);
    //console.log(declined_reason);

    //Update state bảng articles
    articlesModel.setStateToDeclined(article_id);

    //Insert bảng declined_articles
    articlesModel.addToDeclinedArticles(article_id, editor_id, declined_reason);

    res.redirect('/editor');
});

module.exports = router;