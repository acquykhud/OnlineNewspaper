module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('view/home');
    });

    app.use('/writer/', require('../controllers/writer.route'));
    app.use('/editor/', require('../controllers/editor.route'));
    app.use('/ajax/', require('../controllers/ajax.route'));
    app.use('/user/', require('../controllers/user.route'));
    app.use('/view/', require('../controllers/view.route'));
    app.use('/admin/', require('../controllers/admin.route'));
}