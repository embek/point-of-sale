var express = require('express');
var router = express.Router();
const Purchase = require('../models/Purchase');
const Good = require('../models/Good');
const Supplier = require('../models/Supplier');

router.get('/', (req, res) => {
    res.render('purchases/list', { operator: req.session.userid.name })
})

router.get('/add', async (req, res) => {
    try {
        await Purchase.add({ operator: req.session.userid.userid });
        const response = await Purchase.list({ length: 1 });
        const data = await Purchase.cek(response.data[0].invoice);
        const listGoods = await Good.list({});
        res.render('purchases/edit', { data, listGoods, operator: req.session.userid.name })
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
        res.render('purchases/edit', { listGoods, operator: req.session.userid.name, dataPurchase, listSuppliers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Purchase.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})
module.exports = router;
