import { Router } from "express";
import { addReivew, getReviews } from "../controller/review.controller.js";

const router = new Router();

router.get('/get-reviews/:p_id', (req, res) => {
    getReviews(req.params.p_id).then((reviews) => {
        res.send(reviews);
    }).catch((err) => {
        res.status(404).send(err);
    });
});


router.post('/add-review', (req, res) => {
    addReivew(req.body.product_id, req.body.comment, req.body.rating, req.body.name).then((ress) => {
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

export default router;