module.exports = {
    requireLogin: function requireLogIn(req, res, next) {
        if (req.session.logged === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/user/login');
        }
        next();
    },

    requireNoLogin: function requireNoLogin(req, res, next) {
        if (req.session.logged === true) {
            return res.redirect('/');
        }
        req.session.retUrl = req.originalUrl;
        next();
    }
}