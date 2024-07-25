var express = require('express');
var router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('login', { fail: req.flash('fail') });
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await User.cek('email', email);
        const verified = bcrypt.compareSync(password, data.password);
        if (verified) {
            req.session.userid = data;
            res.redirect('/dashboard');
        } else throw Error('wrong email or password')
    } catch (error) {
        console.log(error);
        req.flash('fail', 'wrong email or password');
        res.redirect('/');
    }
})

router.get('/logout', function (req, res, next) {
    delete req.session.userid;
    res.redirect('/')
});

module.exports = router;
