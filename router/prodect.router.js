import { Router } from "express";
import { getProducts, getProductByID, addProduct, reduceQuantity, filter, update, deleteProduct, updateRating, getProductsCate } from "../controller/product.controller.js";

const router = new Router();


router.get('/products', (req, res) => {
    getProducts().then((products) => {
        res.send(products)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.get('/products-cate/:category', (req, res) => {
    console.log(req.params)
    getProductsCate(req.params.category).then((products) => {
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


router.post('/qty-red', (req, res) => {
    reduceQuantity(req.body.name, req.body.quantity).then((ress) => {
        console.log(req.body)
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });
});


router.post('/like', (req, res) => {
    filter(req.body.price, req.body.about, req.body.category).then((ress) => {
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });
});


router.put('/update', (req, res) => {
    update(req.body.id, req.body.productName, req.body.price, req.body.images, req.body.thumbnail, req.body.description, req.body.quantity, req.body.discount, req.body.about, req.body.category).then((ress) => {
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    })
})


router.delete('/delete/:id', (req, res) => {
    deleteProduct(req.params.id).then((ress) => {
        res.send(ress)
    }).catch((err) => {
        res.status(404).send(err);
    });
});

router.post('/add', (req, res) => {
    addProduct(req.body.id, req.body.productName, req.body.price, req.body.images, req.body.thumbnail, req.body.description, req.body.quantity, req.body.discount, req.body.about, req.body.category).then((ress) => {
        res.status(200).send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });

});

router.post('/update-rating', (req, res) => {

    updateRating(req.body.id, req.body.rating).then((ress) => {
        res.status(200).send(ress);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


export default router;