var express = require('express');
const Sale = require('../models/Sale');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { operator: req.session.userid });
});

router.get('/data', async (req, res) => {
  try {
    const response = await Sale.joinPurchases(req.query);
    const totalSales = await Sale.total(req.query);
    const sources = await Sale.sources(req.query);
    res.status(200).json({ ...response, totalSales, sources });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
