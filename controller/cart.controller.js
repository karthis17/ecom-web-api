import { db } from "../model/product.model.js";


let sql = {
    SELECT_CART: "SELECT * FROM cart_list WHERE user_id = ? AND ordered = ?",
    INSERT_CART: "INSERT INTO cart_list (product_id, productName, price, quantity, user_id, total, ordered) VALUES (?,?, ?,?, ?,?, ?)",
    DELETE_CART_ITEM: "DELETE FROM cart_list WHERE id = ?",
    UPDATE_QTY: "UPDATE cart_list SET quantity = ?, total=? WHERE id = ?",
    UPDATE_TO_ORDER: "UPDATE cart_list SET ordered = 1 where user_id = ?",
    SELECT_ORDERED: "SELECT * FROM cart_list WHERE order_id = ?",
    UPDATE_ORDER_ID: `UPDATE cart_list SET order_id = ? WHERE user_id = ? AND ordered = 1 AND order_id IS NULL`,
}

export const getCartItems = (user_id, orderd = 0) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_CART, [user_id, orderd], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

}

export const addItemToCart = (product_id, productName, price, quantity, user_id, ordered) => {

    return new Promise((resolve, reject) => {
        db.run(sql.INSERT_CART, [product_id, productName, price, quantity, user_id, quantity * price, ordered], function (err, result) {
            if (err) {
                return reject(err);
            }

            resolve({ success: true, message: "Cart added successfully", id: this.lastID });
        })
    })

}

export const deleteItemFromCart = (id) => {


    return new Promise((resolve, reject) => {
        db.run(sql.DELETE_CART_ITEM, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve({ success: true, message: "deleted successfully" });
        })
    });

}

export const updateItemQuantityCart = (id, quantity, total) => {

    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_QTY, [quantity, total, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: "updated successfully" });
        });
    });

}

export const updateToOrdered = (user_id) => {


    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_TO_ORDER, [user_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            let qty = [];
            getCartItems(user_id, 1).then(async (items) => {
                await items.forEach((item) => {
                    qty.push({ quantity: item.quantity, name: item.productName })
                })
                resolve({ success: true, message: "updated successfully", items: qty });
            });
        });
    });

}

export const addOrderId = (user_id, order_id) => {
    console.log(user_id, order_id);
    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_ORDER_ID, [order_id, user_id], (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: "updated successfully" })
        });
    });
}


export const getOrderedItems = (order_id) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_ORDERED, [order_id], (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    });

}