var express = require('express');
var router = express.Router();
const Customer = require('../models/Customer');

router.get('/', (req, res) => {
    res.render('customers/list', { operator: req.session.userid })
})

router.get('/add', (req, res) => {
    res.render('customers/add', { operator: req.session.userid })
})

router.post('/add', async (req, res) => {
    try {
        await Customer.add(req.body);
        res.redirect('/customers')
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:customerid', async (req, res) => {
    const data = await Customer.cek(req.params.customerid);
    res.render('customers/edit', { operator: req.session.userid, data });
})

router.post('/edit/:customerid', async (req, res) => {
    try {
        await Customer.edit({ customerid: req.params.customerid, ...req.body });
        res.redirect('/customers');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:customerid', async (req, res) => {
    try {
        await Customer.hapus(req.params.customerid);
        res.redirect('/customers');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Customer.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;