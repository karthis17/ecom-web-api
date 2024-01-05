import { Router } from "express";
import { addItemToOrder, getOrderHistory } from "../controller/order.controller.js";

const router = new Router();


router.get('/getOrders/:user_id', (req, res) => {
    getOrderHistory(req.params.user_id).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

router.post('/addOrder', (req, res) => {
    addItemToOrder(req.body.user_id, req.body.phone, req.body.payment, req.body.address).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
})



export default router;