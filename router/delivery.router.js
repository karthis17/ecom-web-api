import { Router } from "express";
import { addDtl, getDeliverDtl } from "../controller/delivery.controller.js";
import { authonticatedUser } from "../controller/user.controller.js"
const router = new Router();

router.get('/get-dtl', authonticatedUser, (req, res) => {
    getDeliverDtl(req.user).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


router.post('/add-dtl', authonticatedUser, (req, res) => {
    console.log(req.body)
    addDtl({ ...req.body, user: req.user }).then((response) => {
        res.status(200).send(response);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

export default router;