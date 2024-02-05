import { db } from "../model/product.model.js";
import { addOrderId, deleteItemFromCart } from "./cart.controller.js";

let sql = {
    SELECT_ORDERS: 'SELECT * FROM order_history WHERE user_id = ? AND has_products = 1 ORDER BY id DESC',
    SELECT_ORDERS_RETURNED: 'SELECT * FROM order_history WHERE has_returned = 1 ORDER BY id DESC',
    SELECT_ALL: 'SELECT * FROM order_history WHERE has_products= 1 ORDER BY id DESC',
    INSERT_ORDERS: 'INSERT INTO order_history (user_id, phone, address, payment_method, date, name, email, has_products) VALUES (?,?,?,?,?,?,?,1)',
}


export const getOrderHistory = (user_id) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_ORDERS, [user_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

}


export const addItemToOrder = (user_id, phone, payment, address, name, email) => {

    return new Promise((resolve, reject) => {

        let date = new Date();
        db.run(sql.INSERT_ORDERS, [user_id, phone, address, payment, date, name, email], async function (err, result) {
            if (err) {
                return reject(err);
            }

            resolve(await addOrderId(user_id, this.lastID));
        });

    });
}

export const getAll = () => {
    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_ALL, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

export const getAllReturned = () => {
    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_ORDERS_RETURNED, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

export const returnProduct = (product_id, order_id, quantity, cart_id, resone) => {
    return new Promise((resolve, reject) => {
        db.run("UPDATE cart_list SET returned = 1, resone_for_return=?, return_date=? WHERE id = ?", [resone, new Date(), cart_id], (err) => {
            if (err) { return reject(err); }
            db.all("SELECT * FROM cart_list WHERE order_id = ? AND returned = 0", [order_id], (err, res) => {
                if (err) { return reject(err); }
                if (res.length > 0) {
                    db.run("UPDATE order_history SET has_returned = 1, has_products = 1 WHERE id = ? ", [order_id], (err, res) => {
                        db.run("UPDATE products SET quantity = quantity + ? WHERE id = ?", [quantity, product_id], (err, result) => {
                            if (err) { return reject(err); }
                            resolve({ success: true, message: "successfully returned the product", });
                        });
                    })
                } else {
                    db.run("UPDATE order_history SET has_returned = 1, has_products = 0 WHERE id = ? ", [order_id], (err, res) => {
                        db.run("UPDATE products SET quantity = quantity + ? WHERE id = ?", [quantity, product_id], (err, result) => {
                            if (err) { return reject(err); }
                            resolve({ success: true, message: "successfully returned the product", });
                        });
                    })
                }
            })

        })
    })
}

