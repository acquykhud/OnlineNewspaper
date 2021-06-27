const express = require("express");
const morgan = require("morgan");
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const app = express();

let logged = false;

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
}));
app.set('view engine', 'hbs');

app.use('/public', express.static('public'))

app.use(morgan("dev"));

app.use(express.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index', {logged: logged});
});

app.get('/view/cat/1', function (req, res) {
    res.render('post/post_list_by_cat', {logged: logged});
});

app.get('/view/tag/1', function (req, res) {
    res.render('post/post_list_by_tag', {logged: logged});
});

app.get('/view/post/1', function (req, res) {
    res.render('post/view_post', {logged: logged});
});

app.get('/user/login', function (req, res) {  
    res.render('user/login', {logged: logged});
});

app.post('/user/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username == "a" && password == "a") {
    logged = true;
  }
  res.redirect('/');
});

app.get('/user/logout', function (req, res) {
    logged = false;
    res.redirect('/');
});

app.get('/user/resetpwd', function (req, res) {
    res.render('user/reset_password', {logged: logged});
});

app.get('/user/register', function (req, res) {
    res.render('user/register', {logged: logged});
});

app.get('/user/info', function (req, res) {
    res.render('user/info', {logged: logged});
});

app.get('/user/update', function (req, res) {
    res.render('user/update_info', {logged: logged});
});

app.get('/user/changepwd', function (req, res) {
    res.render('user/change_password', {logged: logged});
});

app.get('/writer', function (req, res) {
    res.render('writer/list_own_post', {logged: logged});
});

app.get('/writer/edit/1', function (req, res) {
    res.render('writer/edit_post', {logged: logged});
});

app.get('/writer/new', function (req, res) {
    res.render('writer/edit_post', {logged: logged});
});

app.get('/editor', function (req, res) {
    res.render('editor/list_managed_post', {logged: logged});
});

app.get('/admin', function (req, res) {
    res.redirect('/admin/category');
});

app.get('/admin/category', function (req, res) {
    res.redirect('/admin/category/1');
});

app.get('/admin/category/1', function (req, res) {
    res.render('admin/category', {logged: logged});
});

app.get('/admin/tag', function (req, res) {
    res.render('admin/tag', {logged: logged});
});

const PORT = 3000;
app.listen(PORT, function() {
    console.log(`OnlineNewspaper Web listening at http://localhost:${PORT}`);
});