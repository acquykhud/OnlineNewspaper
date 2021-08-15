const express = require('express');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/admin/category');
});

router.get('/category', auth.requireAdminAccount, function (req, res) {
    res.render('admin/category', {layout: 'admin.hbs', path: 'category'});
});

router.get('/tag', auth.requireAdminAccount, function (req, res) {
    res.render('admin/tag', {layout: 'admin.hbs', path: 'tag'});
});

module.exports = router;