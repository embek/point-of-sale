var express = require('express');
var router = express.Router();
const Purchase = require('../models/Purchase');
const Purchaseitem = require('../models/Purchaseitem');
router.post('/add', async (req, res) => {
    try {
        const { invoice, barcode, operator, quantity } = req.body;
        const ada = await Purchaseitem.cek(invoice, barcode);
        if (ada) {
            await Purchase.edit({ operator, invoice });
            await Purchaseitem.edit({ id: ada.id, quantity });
        } else {
            await Purchaseitem.add({ invoice, quantity, itemcode: barcode });
        }
        const list = await Purchaseitem.joinGoods(invoice);
        const purchase = await Purchase.cek(invoice);
        res.status(200).json({ list, purchase });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        const { invoice } = await Purchaseitem.cekId(req.params.id);
        await Purchaseitem.hapus(req.params.id);
        const list = await Purchaseitem.joinGoods(invoice);
        const purchase = await Purchase.cek(invoice);
        res.status(200).json({ list, purchase });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


module.exports = router;
