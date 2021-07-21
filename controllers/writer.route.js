const express = require('express');

const articlesModel = require('../models/articles.model');
const tagsModel = require('../models/tags.model');

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
        } else {
            article.cat_subcat = 'undefined';
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

router.get('/edit/:id/', async function(req, res) {
    const article_id = req.params.id;
    let article = await articlesModel.getArticleForWriter(article_id);
    //console.log(article);
    if (!((article.state === 3 || article.state === 4) && author_id === article.author_id)) {
        article = undefined;
    }
    res.render('writer/edit_post', {
        logged: logged,
        article: article,
        article_id: article_id
    });
});

router.post('/edit-post', async function(req, res) {
    const article_id = req.body.article_id;
    const title = req.body.title;
    const subcategory_id = req.body.subcategory_id;
    const abstract = req.body.abstract;
    const content = req.body.content;
    const tags = req.body.tags[1].split(',');
    const avatar_path = req.body.avatar;

    // console.log(article_id);
    // console.log(title);
    // console.log(subcategory_id);
    // console.log(abstract);
    // console.log(content);
    // console.log(tags);

    await articlesModel.updateArticleFromWriter(article_id, title, abstract, content, avatar_path);
    await articlesModel.updateSubcategoryForArticle(article_id, subcategory_id);
    await tagsModel.addTagList(tags);
    await articlesModel.updateTagsForArticle(article_id, tags);
    res.redirect('/writer');
})


router.get('/new', function(req, res) {
    res.render('writer/new_post', {
        logged: logged
    });
});

router.post('/add-new-post', async function(req, res) {
    const title = req.body.title;
    const subcategory_id = req.body.subcategory_id;
    const abstract = req.body.abstract;
    const content = req.body.content;
    const tags = req.body.tags[1].split(',');
    const avatar_path = req.body.avatar;

    // console.log(title);
    // console.log(subcategory_id);
    // console.log(abstract);
    // console.log(content);
    // console.log(tags);

    const addResult = await articlesModel.addArticleFromWriter(author_id, title, content, abstract, avatar_path);
    const article_id = addResult[0].insertId;
    await articlesModel.insertSubcategoryForArticle(article_id, subcategory_id);
    await tagsModel.addTagList(tags);
    await articlesModel.updateTagsForArticle(article_id, tags);
    res.redirect('/writer');
})

module.exports = router;