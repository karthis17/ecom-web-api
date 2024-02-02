import { Router } from "express";
import { addItemToOrder, getAll, getAllReturned, getOrderHistory, returnProduct } from "../controller/order.controller.js";
import { authonticatedUser } from "../controller/user.controller.js";
import { authonticatedAdmin } from "../controller/admin.controller.js";

const router = new Router();


router.get('/getOrders/:user_id', authonticatedUser, (req, res) => {
    getOrderHistory(req.params.user_id).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/addOrder', authonticatedUser, (req, res) => {
    addItemToOrder(req.body.user_id, req.body.phone, req.body.payment, req.body.address, req.body.name, req.body.email).then((response) => {
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
    returnProduct(req.body.product_id, req.body.order_id, req.body.quantity, req.body.id, req.body.resone).then((orders) => {
        res.send(orders);
    }).catch((err) => {
        res.status(500).send(err);
    });
});



export default router;