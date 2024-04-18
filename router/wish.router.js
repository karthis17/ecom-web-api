import express from "express";
import { authonticatedUser } from "../controller/user.controller.js";
import { Wish } from "../model/wish.model.js";

const router = express.Router();


router.get('/wish-list', authonticatedUser, async function (req, res) {
    try {
        const wish = await Wish.find({ user: req.user }).populate('product').populate('user');

        res.send(wish);

    } catch (error) {
        res.status(404).send(error.message);
    }
});


router.post('/wish-list', authonticatedUser, async function (req, res) {

    const { product } = req.body;

    console.log(product)
    try {
        const wish = new Wish({
            user: req.user,
            product
        });

        await wish.save()

        res.send(wish);
    } catch (error) {

        res.status(500).send(error.message);

    }
});

router.delete('/wish-list/:id', authonticatedUser, async function (req, res) {

    const { id } = req.params;

    try {
        let response = await Wish.deleteOne({ _id: id });

        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/wish-list-count', authonticatedUser, async function (req, res) {

    try {
        let count = await Wish.countDocuments({ user: req.user });

        res.send({ count });

    } catch (error) {
        res.status(500).send({ err: error.message });
    }

})

export default router;