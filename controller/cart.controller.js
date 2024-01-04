import { db } from "../model/product.model.js";


let sql = {
    SELECT_CART: "SELECT * FROM cart_list WHERE user_id = ?",
    INSERT_CART: "INSERT INTO cart_list (productName, price, quantity, user_id, total) VALUES (?, ?,?, ?,?)",
    DELETE_CART_ITEM: "DELETE FROM cart_list WHERE id = ?",
    UPDATE_QTY: "UPDATE cart_list SET quantity = ?, total=? WHERE id = ?",
}

export const getCartItems = (user_id) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_CART, [user_id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });

}

export const addItemToCart = (productName, price, quantity, user_id) => {

    return new Promise((resolve, reject) => {
        db.run(sql.INSERT_CART, [productName, price, quantity, user_id, quantity * price], function (err, result) {
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

    console.log(id, quantity, total)
    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_QTY, [quantity, total, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: "updated successfully" });
        });
    });

}