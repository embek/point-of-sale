var express = require('express');
var router = express.Router();
const Unit = require('../models/Unit');
const { isAdmin } = require('../helpers/util');

router.get('/', isAdmin, (req, res) => {
    res.render('units/list', { operator: req.session.userid });
})

router.get('/add', isAdmin, (req, res) => {
    res.render('units/add', { operator: req.session.userid });
})

router.post('/add', isAdmin, async (req, res) => {
    try {
        await Unit.add(req.body);
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/edit/:unit', isAdmin, async (req, res) => {
    try {
        const data = await Unit.cek(req.params.unit);
        res.render('units/edit', { operator: req.session.userid, data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }

})

router.post('/edit/:unit', isAdmin, async (req, res) => {
    try {///PK unitnya bisa ganti ,jadi pake property unit lama dalam objectData
        await Unit.edit({ lama: req.params.unit, ...req.body });
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/data', async (req, res) => {
    try {
        const response = await Unit.list(req.query);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/delete/:unit', isAdmin, async (req, res) => {
    try {
        await Unit.hapus(req.params.unit);
        res.redirect('/units');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
