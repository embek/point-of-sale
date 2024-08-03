var express = require('express');
var router = express.Router();
const Sale = require('../models/Sale');
const Saleitem = require('../models/Saleitem');
router.post('/add', async (req, res) => {
    try {
        const { invoice, barcode, operator, quantity } = req.body;
        const ada = await Saleitem.cek(invoice, barcode);
        if (ada) {
            await Sale.edit({ operator, invoice });
            await Saleitem.edit({ id: ada.id, quantity });
        } else {
            await Saleitem.add({ invoice, quantity, itemcode: barcode });
        }
        const list = await Saleitem.joinGoods(invoice);
        const sale = await Sale.cek(invoice);
        res.status(200).json({ list, sale });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        const { invoice } = await Saleitem.cekId(req.params.id);
        await Saleitem.hapus(req.params.id);
        const list = await Saleitem.joinGoods(invoice);
        const sale = await Sale.cek(invoice);
        res.status(200).json({ list, sale });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
