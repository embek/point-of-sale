var express = require('express');
var router = express.Router();
const Purchase = require('../models/Purchase');

router.get('/', (req, res) => {
    res.render('purchases/list', { operator: req.session.userid.name })
})

module.exports = router;
