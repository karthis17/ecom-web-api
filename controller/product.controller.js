import { db } from "../model/product.model.js";

let sql = {
    SELECT_PRODUCT: "SELECT * FROM products",
    SELECT_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ?",
    UPDATE_QTY: "UPDATE products SET qty = ? WHERE productName = ?",
    INSERT_PRODUCT: "INSERT INTO products (productName, price, images, thumbnail, description, quantity, discount, about) VALUES (?,?,?,?,?,?, ?, ?)",
};

export const getProducts = () => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_PRODUCT, (err, products) => {
            if (err) {
                return reject(err);
            }

            resolve(products);
        });
    });

}


export const getProductByID = (id) => {

    return new Promise((resolve, reject) => {
        db.get(sql.SELECT_PRODUCT_BY_ID, [id], (err, products) => {
            if (err) {
                return reject(err);
            }

            resolve(products);
        });
    });

}

export const addProduct = (productName, price, images, thumbnail, description, quantity, discount, about) => {


    return new Promise((resolve, reject) => {
        db.run(sql.INSERT_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about], function (err, result) {
            if (err) {
                return reject(err);
            } else {
                resolve({ success: true, message: "Product added successfully", id: this.lastID });
            }
        })
    });

}



export const reduceQuantity = (productName, quantity) => {

    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_QTY, [quantity, productName], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({
                success: true, message: "Product updated successfully"
            })
        })
    });
}