import { Router } from "express";
import { getProducts, getProductByID, addProduct } from "../controller/product.controller.js";

const router = new Router();


router.get('/products', (req, res) => {
    getProducts().then((products) => {
        res.send(products)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.get('/id/:id', (req, res) => {
    getProductByID(req.params.id).then((products) => {
        res.send(products)
    }).catch((err) => {
        res.status(404).send(err)
    });

});




export default router;