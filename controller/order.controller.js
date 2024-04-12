import { Cart } from "../model/cart.model.js";
import { Orders } from "../model/order.model.js";
// import { db } from "../model/product.model.js";
// import { addOrderId, deleteItemFromCart } from "./cart.controller.js";
import { config } from 'dotenv';
import nodemailer from 'nodemailer'
import { Product } from "../model/product.model.js";


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


export const getOrderHistory = async (user_id) => {

    try {
        const orders = await Orders.find({ user: user_id }).populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        });

        return orders;

    } catch (error) {
        throw error;
    }

}


export const addItemToOrder = async (user, payment, address) => {

    // return new Promise((resolve, reject) => {

    //     let date = new Date();
    //     db.run(sql.INSERT_ORDERS, [user_id, phone, address, payment, date, name, email], async function (err, result) {
    //         if (err) {
    //             return reject(err);
    //         }

    //         resolve(await addOrderId(user_id, this.lastID));
    //     });

    // });

    try {

        const cart = await Cart.find({ user });

        await Promise.all(cart.map(async (ct) => {
            const order = new Orders({
                user, product: ct.product, payment_id: payment, quantity: ct.quantity, total: ct.total, delivery_address: address
            });
            await order.save();
            const product = await Product.findById(ct.product);
            product.quantity -= ct.quantity;
            await product.save();
        }));


        console.log(await Cart.deleteMany({ user }));

        return { success: true, message: 'Order added successfully' };
    } catch (error) {
        console.log(error);
        throw error.message;
    }

}

export const getAll = async () => {
    // return new Promise((resolve, reject) => {
    //     db.all(sql.SELECT_ALL, (err, result) => {
    //         if (err) return reject(err);
    //         resolve(result);
    //     });
    // });

    try {
        return await Orders.find().populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        });
        ;
    } catch (error) {
        throw error;
    }

}

export const getAllReturned = async () => {
    // return new Promise((resolve, reject) => {
    //     db.all(sql.SELECT_ORDERS_RETURNED, (err, result) => {
    //         if (err) return reject(err);
    //         resolve(result);
    //     });
    // });


    try {
        return await Orders.find({ is_returned: true }).populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        });
        ;
    } catch (error) {
        throw error;
    }

}

export const udateReturn_status = async (order_id, status) => {
    try {
        const order = await Orders.findOne({ _id: order_id });
        order.returnStatus = status;

        await order.save();
        return { success: true, order }
    } catch (error) {
        throw error.message;
    }
}

export const returnProduct = async (order_id, resone) => {
    try {
        const order = await Orders.findById(order_id).populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        });


        order.is_returned = true;
        order.return_date = Date.now();
        order.resone = resone;

        await order.save();

        return order;
    } catch (error) {
        throw error;
    }
}

export const setDeliveryStatus = async (status, _id) => {
    try {
        const order = await Orders.findByIdAndUpdate(_id, { $set: { delivery_status: status } });

        return order;
    } catch (error) {
        throw error;
    }
}

export const setTrackId = async (trackId, _id,) => {

    try {
        const order = await Orders.findByIdAndUpdate(_id, { $set: { tracking_id: trackId } }).populate('user');



        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const mailOptions = {
            from: 'recoverid166@gmail.com',
            to: order.user.email,
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
        return { success: true, message: 'tracking_id added successfully' };
    }




    catch (error) {
        throw error;
    }

}


