module.exports = {
    requireLogIn(req, res, next) {
        if (req.session.auth === false) {
            return res.redirect('/user/login');
        }
        next();
    },

    requireNoLogin(req, res, next) {
        if (req.session.auth === true) {
            return res.redirect(req.header.referrer);
        }
        next();
    }
}