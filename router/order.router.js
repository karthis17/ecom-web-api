import { Router } from "express";
import { addItemToOrder, getAll, getAllReturned, getOrderHistory, order_filter, returnProduct, setDeliveryStatus, setTrackId, udateReturn_status } from "../controller/order.controller.js";
import { authonticatedUser } from "../controller/user.controller.js";
import { authonticatedAdmin } from "../controller/admin.controller.js";
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Orders } from "../model/order.model.js";
import axios from "axios";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
const router = new Router();


router.get('/getOrders', authonticatedUser, (req, res) => {
    getOrderHistory(req.user).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/addOrder', authonticatedUser, (req, res) => {
    console.log(req.body);
    addItemToOrder(req.user, req.body.payment, req.body.delivery_address,).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.get('/get-all-orders', authonticatedAdmin, (req, res) => {
    getAll().then((orders) => {
        res.send(orders);
    }).catch((err) => {
        res.status(500).send(err);
    });
});
router.get('/get-all-returned', authonticatedAdmin, (req, res) => {
    getAllReturned().then((orders) => {
        console.log(orders, "hi")
        res.send(orders);
    }).catch((err) => {
        res.status(500).send(err);
    });
});
router.post('/return-product', authonticatedUser, (req, res) => {
    returnProduct(req.body.order_id, req.body.resone).then((orders) => {
        res.send(orders);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/delivery-status', (req, res) => {

    console.log(req.body)
    setDeliveryStatus(req.body.status, req.body.id).then((ress) => { res.send(ress); }).catch((err) => { res.status(500).send(err) });
})

router.post('/tracking-id', (req, res) => {

    console.log(req.body)
    setTrackId(req.body.trackId, req.body.id, req.body.user).then((ress) => { res.send(ress); }).catch((err) => { res.status(500).send(err) });
})


router.put('/update-return-status', (req, res) => {
    udateReturn_status(req.body.id, req.body.status).then((ress) => { res.send(ress); }).catch((err) => { res.status(500).send(err) });
});

// // Generate Blob from PDF
// pdfDocGenerator.getBlob((blob: Blob) => {
//     // Create URL for Blob
//     const blobURL = URL.createObjectURL(blob);

//     // Create an anchor element
//     const anchor = document.createElement('a');
//     anchor.href = blobURL;
//     anchor.download = 'invoice.pdf'; // Set the filename for download

//     // Trigger click event to download
//     document.body.appendChild(anchor);
//     anchor.click();

//     // Clean up
//     document.body.removeChild(anchor);
//     URL.revokeObjectURL(blobURL);
// });





router.get('/invoice/:id', async (req, res) => {

    try {

        const order = await Orders.findById(req.params.id).populate('product').populate('delivery_address');
        // console.log(order);

        const pdf = await generatePDF(order);
        // console.log(pdf);

        pdf.getBuffer((buffer) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
            res.send(buffer);
        });
    } catch (e) {
        res.status(404).send(e.message);
    }
})


router.post('/filter', authonticatedUser, async (req, res) => {

    const { status, order_time } = req.body;

    order_filter(status, order_time, req.user).then((order) => {
        res.send(order);
    }).catch(error => {
        res.status(500).send({ err: error });
    })
})


export default router;