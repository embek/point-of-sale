var express = require('express');
const Sale = require('../models/Sale');
var router = express.Router();
const json2csv = require('json2csv');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { operator: req.session.userid });
});

router.get('/data', async (req, res) => {
  try {
    if (req.query.startdate) {
      let st = new Date(req.query.startdate);
      st.setMinutes(0);
      st.setHours(0);
      req.query.startdate = st;
    }
    if (req.query.enddate) {
      let en = new Date(req.query.enddate);
      en.setMinutes(0);
      en.setHours(0);
      en.setDate(en.getDate() + 1);
      req.query.enddate = en;
    }
    const response = await Sale.joinPurchases(req.query);
    const totalSales = await Sale.total(req.query);
    const sources = await Sale.sources(req.query);
    res.status(200).json({ ...response, totalSales, sources });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

router.get('/data/csv', async (req, res) => {
  try {
    const result = await Sale.joinPurchases(req.query, true);
    const csv = json2csv.parse(result);
    res.header('Content-Type', 'text/csv');
    res.attachment('report.csv').send(csv);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
})

module.exports = router;
