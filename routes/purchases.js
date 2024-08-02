var express = require('express');
var router = express.Router();
const Purchase = require('../models/Purchase');
const Purchaseitem = require('../models/Purchaseitem');
const Good = require('../models/Good');
const Supplier = require('../models/Supplier');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('purchases/list', { operator: req.session.userid });
})

router.post('/', async (req, res) => {
    try {
        await Purchase.edit(req.body);
        res.redirect('/purchases');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/add', async (req, res) => {
    try {
        await Purchase.add({ operator: req.session.userid.userid });
        const response = await Purchase.joinSuppliers({ length: 1 });
        res.redirect(`/purchases/edit/${response.data[0].invoice}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:invoice', async (req, res) => {
    try {
        const dataPurchase = await Purchase.cek(req.params.invoice);
        const dataGoods = await Good.list({});
        const listGoods = dataGoods.data.map(item => {
            return { barcode: item.barcode, name: item.name, stock: item.stock, purchaseprice: item.purchaseprice }
        });
        const dataSuppliers = await Supplier.list({});
        const listSuppliers = dataSuppliers.data.map(item => {
            return { supplierid: item.supplierid, name: item.name }
        })
        const dataUsers = await User.list({});
        const listUsers = dataUsers.data.map(item => {
            return { userid: item.userid, name: item.name }
        })
        res.render('purchases/edit', { listGoods, operator: req.session.userid, dataPurchase, listSuppliers, listUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Purchase.joinSuppliers(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data/:invoice', async (req, res) => {
    try {
        const list = await Purchaseitem.joinGoods(req.params.invoice);
        const purchase = await Purchase.cek(req.params.invoice);
        res.status(200).json({ list, purchase });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:invoice', async (req, res) => {
    try {
        await Purchase.hapus(req.params.invoice);
        res.redirect('/purchases');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
