const express = require("express");
const morgan = require("morgan");
const exphbs = require('express-handlebars');

const app = express();

let logged = false;


// MY VARIABLES

const categoryModel = require('./models/categories.models');
const moment = require('moment');
const helpers = require("./utils/helpers");
// ----------------

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    helpers: require('./utils/handlebars-helpers'),
}));
app.set('view engine', 'hbs');

app.use('/public', express.static('public'));

app.use(morgan("dev"));

app.use(express.urlencoded({
    extended: true
}));

require('./middlewares/locals.mdw')(app);

app.get('/', async function(req, res) {
    const topArticlesByTime = helpers.makePairs(await categoryModel.getTopArticlesByTime());
    const topArticlesByView = helpers.makePairs(await categoryModel.getTopArticlesByView());
    const topArticlesByEachCategory = await categoryModel.getTopArticleOfEachCategory();
    const top3ArticlesByView = await categoryModel.getTopArticlesByView(3);
    res.render('index', {
        logged: logged,
        topArticlesByTime: topArticlesByTime,
        topArticlesByView: topArticlesByView,
        topArticlesByEachCategory: topArticlesByEachCategory,
        top3ArticlesByView: top3ArticlesByView,
    });
});

app.get('/view/search/', async function(req, res) {
    const isValidSub = false;
    const keyword = req.query.keyword || '';
    const page = +req.query.page || 1;
    const offset = (page - 1) * 6;
    if (keyword.length === 0) {
        return res.redirect('/');
    }
    const articlesList = await categoryModel.getArticlesByKeyword(keyword, offset, isValidSub);
    const searchValid = (articlesList.length !== 0);
    if (searchValid) {
        res.render('post/post_list_by_search', {
            articlesList: articlesList,
            keyword: keyword,
            page: page,
            pagingList: await helpers.createPagingList(page, 'keyword', keyword),
        });
    } else {
        console.log('--------> end - reason: wrong search/page');
        res.send('--------> end - reason: wrong search/page');
    }

});

app.get('/view/cat/:id/', async function(req, res) {
    const isValidSub = false;
    const catId = req.params.id;
    const page = +req.query.page || 1;
    const offset = (page - 1) * 6;
    let catIdValid = true;
    const articlesList = await categoryModel.getArticlesByCategory(catId, offset, isValidSub);
    if (articlesList.length === 0)
        catIdValid = false;

    if (catIdValid) {
        // show by categories
        let categoryInfo = {
            category_id: catId,
            category_name: await categoryModel.getNameOfCategory(catId),
        };
        res.render('post/post_list_by_cat', {
            logged: logged,
            page: page,
            categoryInfo: categoryInfo,
            articlesList: articlesList,
            byCat: true, // true means by category
            pagingList: await helpers.createPagingList(page, 'category', catId),
        });
    } else {
        console.log('--------> end - reason: wrong catId/page');
        res.send('--------> end - reason: wrong catId/page');
    }
});

app.get('/view/cat/:id/:subid/', async function(req, res) {
    const isValidSub = false;
    const catId = req.params.id;
    const subId = req.params.subid;
    const page = +req.query.page || 1;
    const offset = (page - 1) * 6;
    let catIdValid = true;
    const articlesList = await categoryModel.getArticlesByCategory(catId, 0); // only need to validate category id, so offset = 0!!
    if (articlesList.length === 0)
        catIdValid = false;
    let subIdValid = false;
    if (catIdValid === true)
        subIdValid = await categoryModel.isSubCategoryIDValid(subId);
    const articlesListBySubcategory = await categoryModel.getArticlesBySubCategory(subId, offset, isValidSub);
    if (articlesListBySubcategory.length === 0)
        subIdValid = false;
    if (catIdValid && subIdValid) {
        // show by sub-categories
        let categoryInfo = {
            category_id: catId,
            subCategory_id: subId,
            category_name: await categoryModel.getNameOfCategory(catId),
            subCategory_name: await categoryModel.getNameOfSubCategory(subId),
        };
        res.render('post/post_list_by_cat', {
            logged: logged,
            page: page,
            categoryInfo: categoryInfo,
            articlesList: articlesListBySubcategory,
            byCat: false, // false means by subcategory_id
            pagingList: await helpers.createPagingList(page, 'subcategory', subId),
        });
    } else {
        console.log('--------> end - reason: wrong catId/subId/page');
        res.send('--------> end - reason: wrong catId/subId/page'); // wrong both!
    }
});

app.get('/view/tag/:id', async function(req, res) {
    const tagId = req.params.id;
    let tagIdValid = true;
    const articlesList = await categoryModel.getArticlesByTag(tagId);
    if (articlesList.length === 0)
        tagIdValid = false;
    const page = +req.query.page || 1;
    if (tagIdValid) {
        const tagName = await categoryModel.getNameOfTag(tagId);
        res.render('post/post_list_by_tag', {
            logged: logged,
            tagId: tagId,
            tagName: tagName,
            articlesList: articlesList,
        });
    } else {
        console.log('--------> end - reason: wrong tagId');
        res.send('--------> end - reason: wrong tagId');
    }
});

app.get('/view/post/:id/', async function(req, res) {
    const articleId = req.params.id;
    let article = await categoryModel.getArticleById(articleId);
    if (article === null) {
        return res.send('--------> end - reason: wrong article_id');
    }
    const comments = await categoryModel.getCommentsByArticleId(articleId);
    const subCategoryId = await categoryModel.getSubCatgoryByArticleId(articleId);
    const categoryId = await categoryModel.getCatgoryByArticleId(articleId);
    const categoryName = await categoryModel.getNameOfCategory(categoryId);
    const subCategoryName = await categoryModel.getNameOfSubCategory(subCategoryId);
    const sameCategoryList = await categoryModel.getSameArticlesByCategory(categoryId, articleId);
    res.render('post/view_post', {
        logged: logged,
        article: article,
        comments: comments,
        subCategoryId: subCategoryId,
        categoryId: categoryId,
        categoryName: categoryName,
        subCategoryName: subCategoryName,
        sameCategoryList: sameCategoryList,
        sameCategoryListEmpty: (sameCategoryList.length === 0),
    });
});

app.post('/view/post/post_comment/', async function(req, res) {
    const oldUrl = req.headers.referrer || req.headers.referer || '/';
    const commentContent = req.body.comment_content;
    const articleId = req.body.article_id;
    if (typeof commentContent === 'undefined' || commentContent.length === 0 || typeof articleId === 'undefined') {
        return res.redirect(oldUrl);
    }
    const time = moment().format('YYYY-MM-DD hh:mm:ss');
    const userId = 4; // <--------- fix this
    await categoryModel.postComment(articleId, time, userId, commentContent);
    res.redirect(oldUrl);
});

app.post('/search/', async function(req, res) {

});

app.get('/user/login', function(req, res) {
    res.render('user/login', { logged: logged });
});

app.post('/user/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username == "a" && password == "a") {
        logged = true;
    }
    res.redirect('/');
});

app.get('/user/logout', function(req, res) {
    logged = false;
    res.redirect('/');
});

app.get('/user/resetpwd', function(req, res) {
    res.render('user/reset_password', { logged: logged });
});

app.get('/user/register', function(req, res) {
    res.render('user/register', { logged: logged });
});

app.get('/user/info', function(req, res) {
    res.render('user/info', { logged: logged });
});

app.get('/user/update', function(req, res) {
    res.render('user/update_info', { logged: logged });
});

app.get('/user/changepwd', function(req, res) {
    res.render('user/change_password', { logged: logged });
});

require('./middlewares/routes.mdw.js')(app);

// app.get('/writer', function (req, res) {
//     res.render('writer/list_own_post', { logged: logged });
// });

// app.get('/writer/edit/1', function (req, res) {
//     res.render('writer/edit_post', { logged: logged });
// });

// app.get('/writer/new', function (req, res) {
//     res.render('writer/edit_post', { logged: logged });
// });

// app.get('/editor', function(req, res) {
//     res.render('editor/list_managed_post', { logged: logged });
// });

app.get('/admin', function(req, res) {
    res.redirect('/admin/category');
});

app.get('/admin/category', function(req, res) {
    res.redirect('/admin/category/1');
});

app.get('/admin/category/1', function(req, res) {
    res.render('admin/category', { logged: logged });
});

app.get('/admin/tag', function(req, res) {
    res.render('admin/tag', { logged: logged });
});

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`OnlineNewspaper Web listening at http://localhost:${PORT}`);
});