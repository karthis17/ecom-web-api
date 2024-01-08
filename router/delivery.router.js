import { Router } from "express";
import { addDtl, getDeliverDtl } from "../controller/delivery.controller.js";

const router = new Router();

router.get('/get-dtl/:user_id', (req, res) => {
    getDeliverDtl(req.params.user_id).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


router.post('/add-dtl', (req, res) => {
    addDtl(req.body.user_id, req.body.address, req.body.phone, req.body.email).then((response) => {
        res.status(200).send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

export default router;