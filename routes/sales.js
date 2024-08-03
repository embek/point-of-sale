var express = require('express');
var router = express.Router();
const Sale = require('../models/Sale');
const Saleitem = require('../models/Saleitem');
const Good = require('../models/Good');
const Customer = require('../models/Customer');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('sales/list', { operator: req.session.userid });
})

router.post('/', async (req, res) => {
    try {
        await Sale.edit(req.body);
        res.redirect('/sales');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/add', async (req, res) => {
    try {
        await Sale.add({ operator: req.session.userid.userid });
        const response = await Sale.joinCustomers({ length: 1 });
        res.redirect(`/sales/edit/${response.data[0].invoice}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:invoice', async (req, res) => {
    try {
        const dataSale = await Sale.cek(req.params.invoice);
        const dataGoods = await Good.list({}, true);
        const listGoods = dataGoods.data.map(item => {
            return { barcode: item.barcode, name: item.name, stock: item.stock, sellingprice: item.sellingprice }
        });
        const dataCustomers = await Customer.list({});
        const listCustomers = dataCustomers.data.map(item => {
            return { customerid: item.customerid, name: item.name }
        })
        const dataUsers = await User.list({});
        const listUsers = dataUsers.data.map(item => {
            return { userid: item.userid, name: item.name }
        })
        res.render('sales/edit', { listGoods, operator: req.session.userid, dataSale, listCustomers, listUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Sale.joinCustomers(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data/:invoice', async (req, res) => {
    try {
        const list = await Saleitem.joinGoods(req.params.invoice);
        const sale = await Sale.cek(req.params.invoice);
        res.status(200).json({ list, sale });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:invoice', async (req, res) => {
    try {
        await Sale.hapus(req.params.invoice);
        res.redirect('/sales');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
