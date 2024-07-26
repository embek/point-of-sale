var express = require('express');
var router = express.Router();
const Good = require('../models/Good');
const Unit = require('../models/Unit');
const { unlinkSync } = require('node:fs');
const path = require('node:path');

router.get('/', (req, res) => {
    res.render('goods/list', { operator: req.session.userid.name });
})

router.get('/add', async (req, res) => {
    const { data } = await Unit.list({});
    res.render('goods/add', { operator: req.session.userid.name, units: data.map(item => item.unit) });
})

router.post('/add', async (req, res) => {
    try {
        console.log(req.body, req.files);
        let sampleFile = req.files.picture;
        let fileName = JSON.stringify(Date.now()) + sampleFile.name;
        let uploadPath = path.join(__dirname, '..', 'public', 'images', 'goods', fileName);
        await sampleFile.mv(uploadPath);
        await Good.add({ ...req.body, picture: fileName });
        res.redirect('/goods');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:barcode', async (req, res) => {
    try {
        const data = await Good.cek(req.params.barcode);
        const listUnit = await Unit.list({});
        res.render('goods/edit', { operator: req.session.userid.name, data, units: listUnit.data.map(item => item.unit) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.post('/edit/:barcode', async (req, res) => {
    try {
        const data = await Good.cek(req.params.barcode);
        console.log(data);
        if (req.files?.picture) {
            const picturePath = path.join(__dirname, '..', 'public', 'images', 'goods', data.picture);
            unlinkSync(picturePath);
            const sampleFile = req.files.picture;
            const fileName = JSON.stringify(Date.now()) + sampleFile.name;
            const uploadPath = path.join(__dirname, '..', 'public', 'images', 'goods', fileName);
            await sampleFile.mv(uploadPath);
            await Good.edit({ ...req.body, picture: fileName });
        } else {
            await Good.edit({ ...data, ...req.body })
        }
        res.redirect('/goods');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Good.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:barcode', async (req, res) => {
    try {
        const data = await Good.cek(req.params.barcode);
        const picturePath = path.join(__dirname, '..', 'public', 'images', 'goods', data.picture);
        unlinkSync(picturePath);
        await Good.hapus(req.params.barcode);
        res.redirect('/goods');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
