import { Brand } from "../model/brand.model.js";
import express from "express";

const router = express.Router();

router.get('/brand/:category', async (req, res) => {
    const category = req.params.category;
    try {

        const brand = category !== 'All' ? await Brand.find({ category: { $in: category } }) : await Brand.find();
        res.send(brand);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});


router.get('/brand', async (req, res) => {
    try {
        const brand = await Brand.find();

        res.send(brand);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
})


router.post('/brand', async (req, res) => {
    const { category, thumbnail, name } = req.body;


    try {
        const brand = await Brand.create({
            category, thumbnail, name
        });


        res.send(brand);

    } catch (error) {
        res.status(500).send(error.message);

    }
});


router.put('/brand/:id', async (req, res) => {
    const { category, thumbnail, name } = req.body;


    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, {
            $set: {
                category, thumbnail, name
            }
        });

        res.send(brand);

    } catch (error) {
        res.status(500).send(error.message);

    }
});


router.delete('/brand/:id', async (req, res) => {

    try {
        await Brand.deleteOne({ _id: req.params.id });

        res.send({ success: true, message: 'Successfully deleted' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


export default router;