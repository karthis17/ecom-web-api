import { Router } from "express";
import { addItemToOrder, getAll, getAllReturned, getOrderHistory, returnProduct, setDeliveryStatus, setTrackId, udateReturn_status } from "../controller/order.controller.js";
import { authonticatedUser } from "../controller/user.controller.js";
import { authonticatedAdmin } from "../controller/admin.controller.js";

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


export default router;