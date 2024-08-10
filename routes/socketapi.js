const Good = require("../models/Good");
const Purchase = require('../models/Purchase');
const Purchaseitem = require('../models/Purchaseitem');

const io = require("socket.io")();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
    socket.on('cekstock', async () => {
        try {
            const data = await Good.cekStock();
            io.emit('notif', data);
        } catch (error) {
            console.log(error, 'gagal cekstock');
        }
    })

    socket.on('tambah', async data => {
        try {
            await Purchase.add({ operator: data.operator });
            const response = await Purchase.joinSuppliers({ length: 1 });
            await Purchaseitem.add({ invoice: response.data[0].invoice, quantity: 10, itemcode: data.barcode });
            io.emit('beli', response.data[0].invoice);
        } catch (error) {
            console.log(error, 'gagal tambah goods dari notifikasi');
        }
    })
});
// end of socket.io logic

module.exports = socketapi;