import { db } from "../model/product.model.js";
import { addOrderId, deleteItemFromCart } from "./cart.controller.js";
import { config } from 'dotenv';
import nodemailer from 'nodemailer'


config()
let sql = {
    SELECT_ORDERS: 'SELECT * FROM order_history WHERE user_id = ? AND has_products = 1 ORDER BY id DESC',
    SELECT_ORDERS_RETURNED: 'SELECT * FROM order_history WHERE has_returned = 1 ORDER BY id DESC',
    SELECT_ALL: 'SELECT * FROM order_history WHERE has_products= 1 ORDER BY id DESC',
    INSERT_ORDERS: 'INSERT INTO order_history (user_id, phone, address, payment_method, date, name, email, has_products) VALUES (?,?,?,?,?,?,?,1)',
    UPDATE: 'UPDATE order_history SET delivery_status = ? WHERE id = ?',
    UPDATE_TRACK: 'UPDATE order_history SET tracking_id = ? WHERE id = ?',
    USER: 'SELECT * FROM user WHERE id = ?'
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

export const setDeliveryStatus = (status, _id) => {
    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE, [status, _id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: 'Updated ' });
        })
    })
}

export const setTrackId = (trackId, _id, user) => {
    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE_TRACK, [trackId, _id], (err, result) => {
            if (err) {
                return reject(err);
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.user,
                    pass: process.env.pass
                }
            });

            db.get(sql.USER, [user], (err, result) => {
                if (result) {
                    console.log(result);
                    const mailOptions = {
                        from: 'recoverid166@gmail.com',
                        to: result.email,
                        subject: 'Sending Email using Node.js',
                        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password OTP</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 20px;
                }
                a {
                    color: rgb(255, 89, 0);
                    text-decoration: none;

                }
            </style>
            </head>
            <body>
            <div class="container">
                <p>Your order has been out for delivery, track your orderr by below button :</p>
                <p class="otp"><a href="#">Track</a></p>

            </div>
            </body>
            </html>

        `
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            });




            resolve({ success: true, message: 'Updated ' });
        })
    })
}

