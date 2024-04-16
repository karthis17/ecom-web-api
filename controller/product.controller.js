// import { db } from "../model/product.model.js";
import { Product } from "../model/product.model.js";


let sql = {
    SELECT_PRODUCT: "SELECT * FROM products",
    SELECT_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ? OR productName = ?",
    UPDATE_QTY: "UPDATE products SET quantity = ? WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (productName, price, images, thumbnail, description, quantity, discount, about, category, amount,specifiction ) VALUES (?,?,?,?,?,?, ?, ?, ?,?,?)",
    UPDATE_PRODUCT: "UPDATE products SET productName=?, price=?, images=?, thumbnail=?, description=?, quantity=?, discount=?, about=?, amount=?, category=?, specifiction=?  WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ? OR productName=?",
    UPDATE_RATING: "UPDATE products SET rating = ?, noOfRatings=? WHERE id = ?"
};

export const getProducts = () => {

    return new Promise((resolve, reject) => {
        // db.all(sql.SELECT_PRODUCT + ' ORDER BY id DESC', (err, products) => {
        //     if (err) {
        //         return reject(err);
        //     }

        //     // fs.writeFile('./data.json', JSON.stringify(products), (err) => { console.log(err); })
        //     resolve(products);
        // });
        Product.find().then((products) => {
            resolve(products);
        }).catch((err) => {
            reject(err);
        });
    });

}


export const getProductByID = (id_or_name) => {

    return new Promise((resolve, reject) => {
        // db.get(sql.SELECT_PRODUCT_BY_ID, [id_or_name, id_or_name], (err, products) => {
        //     if (err) {
        //         return reject(err);
        //     }

        //     resolve(products);
        // });
        Product.findOne({ $or: [{ _id: id_or_name }, { productName: id_or_name }] }).then((products) => {
            resolve(products);
        }).catch((err) => reject(err));
    });

}

export const addProduct = (productName, price, images, thumbnail, description, quantity, discount, about, category, spec) => {



    return new Promise(async (resolve, reject) => {
        let amount = price;
        console.log(productName, price, images, thumbnail, description, quantity, discount, category)
        if (discount) {
            amount = price - (price * (discount / 100));
        }
        try {
            const product = new Product({
                productName, price, amount, images, thumbnail, description, quantity, discount, category, about, specification: spec
            })

            await product.save();
            resolve(product);
        } catch (err) {
            reject(err)
        }

        // db.get("SELECT * FROM products WHERE LOWER(productName) = ? OR thumbnail = ?", [productName, thumbnail], )
        // db.run(sql.INSERT_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about, category, amount, JSON.stringify(spec)], function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         return reject(err);
        //     } else {
        //         resolve({ success: true, message: "Product added successfully", id: this.lastID });
        //     }
        // })
    });

}



export const reduceQuantity = (productName, quantity) => {

    return new Promise(async (resolve, reject) => {

        try {
            const products = await Product.findOne({ productName });

            products.quantity -= quantity;

            await products.save();
            resolve(products);
        } catch (err) {
            reject(err);
        }
        // getProductByID(productName).then((row) => {

        //     const existingQuantity = row.quantity;


        //     const reducedQuantity = existingQuantity - quantity;

        //     if (reducedQuantity < 0) {
        //         return reject(new Error("New quantity cannot be greater than existing quantity"));
        //     }

        //     db.run(sql.UPDATE_QTY, [reducedQuantity, row.id], (err, result) => {
        //         if (err) {
        //             return reject(err);
        //         }
        //         resolve({
        //             success: true,
        //             message: "Product quantity updated successfully"
        //         });
        //     });
        // });
    });
}

export const filter = async (price, about, category) => {


}

export const update = (id, productName, price, images, thumbnail, description, quantity, discount, about, category, spec) => {
    return new Promise(async (resolve, reject) => {
        let amount = price;
        if (discount) {
            amount = price - (price * (discount / 100));
        }

        const product = await Product.findByIdAndUpdate(id, { $set: { productName, price, images, thumbnail, description, quantity, discount, about, amount, category, specification: spec } })
            .then(result => resolve.result)
            .catch(err => reject(err));

        // db.run(sql.UPDATE_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about, amount, category, JSON.stringify(spec), id], (err, result) => {
        //     if (err) {
        //         return reject(err);
        //     }
        //     resolve({
        //         success: true,
        //         message: 'Updated Product'
        //     });
        // });
    })
}

export const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        // console.log(id)
        // db.run(sql.DELETE_PRODUCT, [id, id], (err, result) => {
        //     if (err) {
        //         return reject(err);
        //     }
        //     resolve({ success: true, message: 'Deleted Product' });
        // });

        Product.deleteOne({ $or: [{ _id: id }, { productName: id }] }).then(result => resolve(result)).catch(err => reject(err));

    });
};


export const updateRating = async (id, nofrating, rating) => {
    try {
        await Product.updateOne({ _id: id }, { rating: rating, numberOfRatings: nofrating }).exec();
        return { success: true, message: 'Updated rating successfully' };
    } catch (err) {
        throw err;
    }
};

export const getProductsCate = async (category) => {
    try {
        const ress = await Product.find({ category: { $regex: category, $options: 'i' } }).sort({ _id: -1 }).exec();
        return ress;
    } catch (err) {
        throw err;
    }
};

export const getAmounts = async (category) => {
    try {
        let query = category === "all" ? {} : { category: { $regex: category, $options: 'i' } };
        const products = await Product.find(query).sort({ amount: 1 }).exec();
        return products.map(product => product.amount);
    } catch (err) {
        throw err;
    }
};

export const fetchProductsSpec = async (filter, category) => {
    try {
        let product;
        if (category === "all") {
            product = await Product.find();
        } else {
            product = await Product.find({ category });
        }

        let results = await Promise.all(product.filter(prod => {
            let spec = JSON.stringify(prod.specification);

            if (spec.toLowerCase().includes(filter.toLowerCase())) {
                return true;
            } else {
                return false;
            }

        }));

        return results;
    } catch (err) {
        console.error(err);
        throw err.message;
    }
};


export const filter_rating = async (rating, category) => {
    try {
        let query = category !== "all" ?
            { rating: { $gte: rating, $lt: rating + 1 }, category: category } :
            { rating: { $gte: rating, $lt: rating + 1 } };

        const results = await Product.find(query).exec();
        return results;
    } catch (err) {
        throw err;
    }
};

export const getOutOfStackProducts = async () => {
    try {
        const results = await Product.find({ quantity: { $lt: 1 } }).exec();
        return results;
    } catch (err) {
        throw err;
    }
};

export const getProductsByCategoryLimited = async () => {
    try {
        const categoryProducts = await Product.aggregate([
            // Sort by category, with "PCs & Laptops" first
            {
                $addFields: {
                    sortKey: { $cond: { if: { $eq: ["$category", "PCs & Laptops"] }, then: 0, else: 1 } }
                }
            },
            { $sort: { sortKey: 1 } },
            { $unset: "sortKey" }, // Remove the temporary sort key
            // Group products by category
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            },
            // Project to limit each category to 4 products
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    products: { $slice: ["$products", 4] }
                }
            }
        ]);

        return categoryProducts.reduce((acc, cur) => {
            acc[cur.category] = cur.products;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const newArraivels = async () => {
    try {
        const product = await Product.find().sort({ createdAt: -1 }).limit(8);

        return product;
    } catch (error) {
        throw error.message;
    }
}



