module.exports = {
    isLoggedIn(req, res, next) {
        if (req.session.userid) return next()
        else res.redirect('/')
    },

    isAdmin(req, res, next) {
        if (req.session.userid.role == 'admin') return next()
        else res.redirect('/sales')
    }
}