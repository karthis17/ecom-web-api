import { db } from "../model/product.model.js";


let sql = {
    SELECT_PRODUCT: "SELECT * FROM products",
    SELECT_PRODUCT_BY_ID: "SELECT * FROM products WHERE id = ? OR productName = ?",
    UPDATE_QTY: "UPDATE products SET quantity = ? WHERE id = ?",
    INSERT_PRODUCT: "INSERT INTO products (productName, price, images, thumbnail, description, quantity, discount, about, category, amount,specifiction ) VALUES (?,?,?,?,?,?, ?, ?, ?,?,?)",
    UPDATE_PRODUCT: "UPDATE products SET productName=?, price=?, images=?, thumbnail=?, description=?, quantity=?, discount=?, about=?, amount=?, category=?, specifiction=?  WHERE id = ?",
    DELETE_PRODUCT: "DELETE FROM products WHERE id = ? OR productName=?",
    UPDATE_RATING: "UPDATE products SET rating = ? WHERE id = ?"
};

export const getProducts = () => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_PRODUCT + ' ORDER BY id DESC', (err, products) => {
            if (err) {
                return reject(err);
            }

            // fs.writeFile('./data.json', JSON.stringify(products), (err) => { console.log(err); })
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

export const addProduct = (productName, price, images, thumbnail, description, quantity, discount, about, category, spec) => {



    return new Promise((resolve, reject) => {
        let amount = price;
        console.log(productName, price, images, thumbnail, description, quantity, discount, category)
        if (discount) {
            amount = price - (price * (discount / 100));
        }
        // db.get("SELECT * FROM products WHERE LOWER(productName) = ? OR thumbnail = ?", [productName, thumbnail], )
        db.run(sql.INSERT_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about, category, amount, JSON.stringify(spec)], function (err, result) {
            if (err) {
                console.error(err);
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
                    return reject(err);
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
            query += ' WHERE amount >= ? AND amount <= ? AND LOWER(about) LIKE ? COLLATE NOCASE ORDER BY id DESC';
            params.push(price[0], price[1], `%${about}%`);
        } else if (price && category) {
            query += ' WHERE amount >= ? AND amount <= ? AND LOWER(category) LIKE ? COLLATE NOCASE ORDER BY id DESC';
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

export const update = (id, productName, price, images, thumbnail, description, quantity, discount, about, category, spec) => {
    return new Promise((resolve, reject) => {
        let amount = price;
        if (discount) {
            amount = price - (price * (discount / 100));
        }
        db.run(sql.UPDATE_PRODUCT, [productName, price, images, thumbnail, description, quantity, discount, about, amount, category, JSON.stringify(spec), id], (err, result) => {
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
        db.all("SELECT * FROM products WHERE category LIKE ? ORDER BY id DESC", [`%${category}%`], (err, ress) => {
            if (err) {
                return reject(err);
            }
            resolve(ress);
        })
    })
}

export const getAmounts = (category) => {
    return new Promise((resolve, reject) => {
        if (category === "all") {
            db.all(sql.SELECT_PRODUCT + " ORDER BY amount", (err, products) => {
                if (err) return reject(err);
                resolve(products.map(product => product.amount));
            })
        } else {
            db.all(sql.SELECT_PRODUCT + " WHERE category LIKE ? ORDER BY amount", [`%${category}`], (err, products) => {
                if (err) return reject(err);
                resolve(products.map(product => product.amount));
            })
        }
    })
}

export const fetchProductsSpec = (filter, category) => {
    return new Promise((resolve, reject) => {
        if (filter.includes(" - ")) {
            const filterValues = filter.split(' - ');
            db.all(
                "SELECT * FROM products WHERE LOWER(specifiction) LIKE ? AND LOWER(specifiction) LIKE ?",
                [`%${filterValues[0].toLowerCase()}%`, `%${filterValues[1].toLowerCase()}%`],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        } else if (category === 'all') {

            db.all("SELECT * FROM products WHERE LOWER(specifiction) LIKE ?", [`%${filter.toLowerCase()}%`], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        } else
            db.all("SELECT * FROM products WHERE LOWER(specifiction) LIKE ? AND category=?", [`%${filter.toLowerCase()}%`, category], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
    })
}

export const filter_rating = (rating, category) => {

    return new Promise((resolve, reject) => {
        if (category !== "all") {
            db.all("SELECT * FROM products WHERE rating >= ? AND rating <= ? AND category = ?", [rating, rating + 1, category], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        } else {
            db.all("SELECT * FROM products WHERE rating >= ? AND rating <= ?", [rating, rating + 1], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            })
        }
    })

}

export const getOutOfStackProducts = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products WHERE quantity < 1", (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}