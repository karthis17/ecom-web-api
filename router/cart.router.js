import { Router } from "express";
import { getCartItems, addItemToCart, deleteItemFromCart, updateItemQuantityCart, updateToOrdered, getOrderedItems } from "../controller/cart.controller.js";

const router = new Router();


router.get('/get-cart/:user_id', (req, res) => {
    getCartItems(req.params.user_id).then((cart) => {
        res.send(cart);
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.post('/new-cart', (req, res) => {
    addItemToCart(req.body.product_id, req.body.productName, req.body.price, req.body.quantity, req.body.user_id, req.body.ordered).then((cart) => {
        res.send(cart)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.delete('/remove-cart/:id', (req, res) => {
    deleteItemFromCart(req.params.id).then((cart) => {
        res.send(cart);
    }).catch((err) => {
        res.status(404).send(err);
    });
});


router.post('/update-qty', (req, res) => {
    updateItemQuantityCart(req.body.id, req.body.qty, req.body.total).then((cart) => {
        res.send(cart);
    }).catch((err) => {
        console.log(err);
        res.status(404).send(err);
    });
});


router.get('/ordered/:user_id', (req, res) => {
    updateToOrdered(req.params.user_id).then((user) => {
        res.status(200).send(user)
    }).catch((err) => {
        res.status(404).send(err);
    });
});

router.post('/get-ordered-items', (req, res) => {
    getOrderedItems(req.body.order_id, req.body.user_id).then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

export default router;