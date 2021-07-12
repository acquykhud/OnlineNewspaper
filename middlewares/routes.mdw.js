module.exports = function(app) {
    app.use('/writer/', require('../controllers/writer.route'));
    app.use('/editor/', require('../controllers/editor.route'));
    app.use('/ajax/', require('../controllers/ajax.route'));
}