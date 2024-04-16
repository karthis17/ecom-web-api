import { Router } from "express";
import {
    getProducts,
    getProductByID,
    addProduct,
    reduceQuantity,
    filter,
    update,
    deleteProduct,
    updateRating,
    getProductsCate,
    getAmounts,
    fetchProductsSpec,
    filter_rating,
    getOutOfStackProducts,
    getProductsByCategoryLimited,
    newArraivels
} from "../controller/product.controller.js";
import { authonticatedUser } from "../controller/user.controller.js";
import { authonticatedAdmin } from "../controller/admin.controller.js";
import { Product } from "../model/product.model.js";

const router = new Router();


router.get('/products', (req, res) => {
    getProducts().then((products) => {
        res.send(products)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.get('/products-cate/:category', (req, res) => {
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


router.post('/qty-red', authonticatedUser, (req, res) => {
    reduceQuantity(req.body.name, req.body.quantity).then((ress) => {
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });
});


router.get('/like', async (req, res) => {
    try {
        let categories = ['PC & Laptops',
            'Mobiles',
            'Headphones & Speakers',
            'Cameras',
            'TVs & Appliances']
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 12;
        const search = req.query.search || "";
        const sort = req.query.sort || "productName";
        const order = req.query.order || 1;
        let category = req.query.category || "All";
        const rating = req.query.rating ? parseInt(req.query.rating) : undefined;
        const discountMin = req.query.discountMin || 0;
        const discountMax = req.query.discountMax || 100;
        const min = parseInt(req.query.min) || 0;
        const max = parseInt(req.query.max) || Number.MAX_SAFE_INTEGER;

        category = category === "All" ? categories : [category];

        const sortBy = {};

        sortBy[sort] = Number.parseInt(order);

        const query = {
            productName: { $regex: search, $options: "i" },
            amount: { $gte: min, $lte: max },
            discount: { $gte: discountMin, $lte: discountMax },
            category: { $in: category }

        };

        if (rating !== undefined) {
            query.rating = rating;
        }

        console.log(query);

        const product = await Product.find(query)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        console.log(product);

        const total = await Product.countDocuments({
            ...query,
        });


        const amount = await Product.find({ category: { $in: category } }).sort({ amount: 1 });

        let totalPage = Math.ceil(total / limit);

        const response = {
            error: false,
            total: totalPage,
            page: page + 1,
            limit,
            category: categories,
            product,
            count: total,
            amount: amount.map(a => a.amount)
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


router.put('/update', authonticatedAdmin, (req, res) => {
    update(req.body.id, req.body.productName, req.body.price, req.body.images, req.body.thumbnail, req.body.description, req.body.quantity, req.body.discount, req.body.about, req.body.category, req.body.spec).then((ress) => {
        res.send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    })
})


router.delete('/delete/:id', authonticatedAdmin, (req, res) => {
    deleteProduct(req.params.id).then((ress) => {
        res.send(ress)
    }).catch((err) => {
        res.status(404).send(err);
    });
});

router.post('/add', authonticatedAdmin, (req, res) => {

    addProduct(req.body.productName, req.body.price, req.body.images, req.body.thumbnail, req.body.description, req.body.quantity, req.body.discount, req.body.about, req.body.category, req.body.spec).then((ress) => {
        res.status(200).send(ress);
    }).catch((err) => {
        res.status(404).send(err);
    });

});

router.post('/update-rating', (req, res) => {
    console.log(req.body);

    updateRating(req.body.id, req.body.nofrating, req.body.rating).then((ress) => {
        res.status(200).send(ress);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


router.get('/amountList/:category', (req, res) => {
    getAmounts(req.params.category).then((amounts) => {
        res.send(amounts);
    }).catch((err) => {
        res.status(500).send(err);
    });
});


router.post('/get-brand-products', (req, res) => {
    fetchProductsSpec(req.body.brand, req.body.category).then((products) => {
        res.send(products);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

router.post('/get-products-by-rating', (req, res) => {
    filter_rating(req.body.rating, req.body.category).then((response) => {
        res.send(response);
    }).catch((err) => {
        res.status(400).send(err);
    });
});


router.get('/outofstock-products', authonticatedAdmin, (req, res) => {
    getOutOfStackProducts().then((products) => {
        res.status(200).send(products);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

router.get('/home', async (req, res) => {
    getProductsByCategoryLimited().then((products) => { res.send(products) }).catch((err) => { res.status(500).send(err) });
})

router.get('/new-arraivels', async (req, res) => {
    newArraivels().then((products) => { res.send(products) }).catch((err) => { res.status(500).send(err) });
})

export default router;