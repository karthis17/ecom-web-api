import { db } from "../model/product.model.js";

let sql = {
    SELECT_PRODUCT: "SELECT * FROM products",
    SELECT_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ? OR productName = ?",
    UPDATE_QTY: "UPDATE products SET quantity = ? WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (id, productName, price, images, thumbnail, description, quantity, discount, about, category, amount) VALUES (?,?,?,?,?,?,?, ?, ?, ?,?)",
    UPDATE_PRODUCT: "UPDATE products SET productName=?, price=?, images=?, thumbnail=?, description=?, quantity=?, discount=?, about=? WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ? OR productName=?",
    UPDATE_RATING: "UPDATE products SET rating = ? WHERE id = ?"
};

export const getProducts = () => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_PRODUCT + ' ORDER BY amount', (err, products) => {
            if (err) {
                return reject(err);
            }

            resolve(products);
        });
    });

}


export const getProductByID = (id_or_name) => {

    return new Promise((resolve, reject) => {
        db.get(sql.SELECT_PRODUCT_BY_ID, [id_or_name, id_or_name], (err, products) => {
            if (err) {
                return reject(err);
            }

            resolve(products);
        });
    });

}

export const addProduct = (id, productName, price, images, thumbnail, description, quantity, discount, about, category) => {



    return new Promise((resolve, reject) => {
        let amount = price;
        console.log(id, productName, price, images, thumbnail, description, quantity, discount, category)
        if (discount) {
            amount = price - (price * (discount / 100));
        }
        db.run(sql.INSERT_PRODUCT, [id, productName, price, images, thumbnail, description, quantity, discount, about, category, amount], function (err, result) {
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

        getProductByID(productName).then((row) => {

            const existingQuantity = row.quantity;


            const reducedQuantity = existingQuantity - quantity;

            if (reducedQuantity < 0) {
                return reject(new Error("New quantity cannot be greater than existing quantity"));
            }

            db.run(sql.UPDATE_QTY, [reducedQuantity, row.id], (err, result) => {
                if (err) {
                    return reject(updateErr);
                }
                resolve({
                    success: true,
                    message: "Product quantity updated successfully"
                });
            });
        });
    });
}

export const filter = (price, about, category) => {

    return new Promise((resolve, reject) => {

        let query = sql.SELECT_PRODUCT;

        let params = [];

        if (price && about && category) {
            query += ' WHERE amount > ? AND amount < ? AND LOWER(about) LIKE ? COLLATE NOCASE AND LOWER(category) LIKE ?';
            params.push(price[0], price[1], `%${about}%`, `%${category}%`);
        }
        else if (price && about) {
            query += ' WHERE amount >= ? AND amount <= ? AND LOWER(about) LIKE ? COLLATE NOCASE ORDER BY amount';
            params.push(price[0], price[1], `%${about}%`);
        } else if (price && category) {
            query += ' WHERE amount >= ? AND amount <= ? AND LOWER(category) LIKE ? COLLATE NOCASE ORDER BY amount';
            params.push(price[0], price[1], `%${category}%`);
        } else if (category && about) {
            query += ' WHERE LOWER(category) LIKE ? COLLATE NOCASE AND LOWER(about) LIKE ? COLLATE NOCASE';
            params.push(`%${category}%`, `%${about}%`);
        }
        else if (price) {
            query += ' WHERE amount >= ? AND amount <= ? ';
            params.push(price[0], price[1]);
        } else if (about) {
            query += ' WHERE LOWER(about) LIKE ? COLLATE NOCASE';
            params.push(`%${about}%`);
        } else {
            query += ' WHERE LOWER(category) LIKE ? COLLATE NOCASE';
            params.push(`%${category}%`);
        }

        db.all(query, params, (err, result) => {
            console.log('Generated Query:', query);
            console.log('Parameters:', params);

            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

}

export const update = (id, productName, price, images, thumbnail, description, quantity, discount, about) => {
    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({
                success: true,
                message: 'Updated Product'
            });
        });
    })
}

export const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        console.log(id)
        db.run(sql.DELETE_PRODUCT, [id, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: 'Deleted Product' });
        });

    });
};


export const updateRating = (id, rating) => {

    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_RATING, [rating, id], (err, res) => {
            if (err) return reject(err);

            resolve({ success: true, message: 'Updated rating successfully' });
        });
    });

};


export const getProductsCate = (category) => {

    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products WHERE category LIKE ? ORDER BY amount", [`%${category}%`], (err, ress) => {
            if (err) {
                return reject(err);
            }
            resolve(ress);
        })
    })
}