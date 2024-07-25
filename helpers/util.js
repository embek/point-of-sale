module.exports = {
    isLoggedIn(req, res, next) {
        if (req.session.userid) return next()
        else res.redirect('/')
    }
}