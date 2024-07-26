var express = require('express');
var router = express.Router();
const Purchase = require('../models/Purchase');

router.get('/', (req, res) => {
    res.render('purchases/list', { operator: req.session.userid.name })
})

router.get('/add', (req, res) => {
    res.render('purchases/add', { operator: req.session.userid.name })
})

router.get('/edit/:invoice', (req, res) => {
    res.render('purchases/edit', { operator: req.session.userid.name })
})
module.exports = router;
