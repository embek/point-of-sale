var express = require('express');
var router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', (req, res) => {
    res.render('suppliers/list', { name: req.session.userid.name })
})

router.get('/add', (req, res) => {
    res.render('suppliers/add', { name: req.session.userid.name })
})

router.post('/add', async (req, res) => {
    try {
        await Supplier.add(req.body);
        res.redirect('/suppliers')
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:supplierid', async (req, res) => {
    const data = await Supplier.cek(req.params.supplierid);
    res.render('suppliers/edit', { name: req.session.userid.name, data });
})

router.post('/edit/:supplierid', async (req, res) => {
    try {
        await Supplier.edit({ supplierid: req.params.supplierid, ...req.body });
        res.redirect('/suppliers');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:supplierid', async (req, res) => {
    try {
        await Supplier.hapus(req.params.supplierid);
        res.redirect('/suppliers');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Supplier.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;