var express = require('express');
var router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users/list', { operator: req.session.userid });
});

router.get('/add', (req, res) => {
  res.render('users/add', { operator: req.session.userid })
})

router.post('/add', async (req, res) => {
  try {
    let { password } = req.body;
    let hash = bcrypt.hashSync(password, saltRounds);
    await User.add({ ...req.body, password: hash });
    res.status(201).redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/edit/:id', async (req, res) => {
  try {
    const data = await User.cek('userid', req.params.id);
    res.render('users/edit', { operator: req.session.userid, data })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.post('/edit/:id', async (req, res) => {
  try {
    await User.edit({ userid: req.params.id, ...req.body });
    res.status(201).redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/data', async (req, res) => {
  try {
    const response = await User.list(req.query);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/delete/:id', async (req, res) => {
  try {
    await User.hapus(req.params.id);
    res.status(200).redirect('/users');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/profile', (req, res) => {
  try {
    res.render('users/profile', { operator: req.session.userid, success: req.flash('success'), fail: req.flash('fail') });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.post('/profile', async (req, res) => {
  try {
    await User.edit(req.body, true);
    const data = await User.cek('userid', req.body.userid);
    req.session.userid = data;
    req.flash('success', 'your profile has been updated');
    res.redirect('/users/profile');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/changepassword', (req, res) => {
  try {
    res.render('users/changepassword', { operator: req.session.userid, success: req.flash('success'), fail: req.flash('fail') });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.post('/changepassword', async (req, res) => {
  try {
    const { userid, oldpass, newpass, retypepass } = req.body;
    const data = await User.cek('userid', userid);
    const verified = bcrypt.compareSync(oldpass, data.password);
    if (verified) {
      if (newpass !== retypepass) {
        req.flash('fail', 'retyped password doesn\'t match');
        res.redirect('/users/changepassword');
      } else {
        const hash = bcrypt.hashSync(newpass, saltRounds);
        await User.edit({ userid, password: hash }, 'password');
        req.flash('success', 'your password has been updated');
        res.redirect('/users/changepassword')
      }
    } else {
      req.flash('fail', 'old password is wrong');
      res.redirect('/users/changepassword');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
