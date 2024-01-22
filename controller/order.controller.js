import { db } from "../model/product.model.js";
import { addOrderId } from "./cart.controller.js";

let sql = {
    SELECT_ORDERS: 'SELECT * FROM order_history WHERE user_id = ? ORDER BY id DESC',
    SELECT_ALL: 'SELECT * FROM order_history ORDER BY id DESC',
    INSERT_ORDERS: 'INSERT INTO order_history (user_id, phone, address, payment_method, date) VALUES (?,?,?,?,?)',
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


export const addItemToOrder = (user_id, phone, payment, address) => {

    return new Promise((resolve, reject) => {

        let date = new Date();

        date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        db.run(sql.INSERT_ORDERS, [user_id, phone, address, payment, date], async function (err, result) {
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
