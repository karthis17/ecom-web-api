import { Cart } from "../model/cart.model.js";
import { Orders } from "../model/order.model.js";
// import { db } from "../model/product.model.js";
// import { addOrderId, deleteItemFromCart } from "./cart.controller.js";
import { config } from 'dotenv';
import nodemailer from 'nodemailer'
import { Product } from "../model/product.model.js";
import { Address } from "../model/deliver.model.js";
import axios from "axios";
import { Invoice } from "../model/invoice.model.js";


config()

export const getOrderHistory = async (user_id) => {

    try {
        const orders = await Orders.find({ user: user_id }).populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        }).sort({ createdAt: - 1 });

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

        const cart = await Cart.find({ user }).populate('product');

        let total = 0

        let order = await Promise.all(cart.map(async (ct) => {
            const order = new Orders({
                user, product: ct.product, payment_id: payment, quantity: ct.quantity, total: ct.total, delivery_address: address, cart: ct._id
            });
            await order.save();

            total += ct.total;

            const product = await Product.findById(ct.product);
            product.quantity -= ct.quantity;
            await product.save();
            await order.populate('product');
            return order
        }));


        console.log(order);

        const add = await Address.findById(address);

        let createdAt = new Date().getDate() + '/' + new Date().getDay() + '/' + new Date().getFullYear();
        const pdfDoc = await generatePDF({ order, total, address: add, user, createdAt }, true);

        let res = await sendInvoice(pdfDoc, add.email);

        if (res) {

        }

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
        }).sort({ createdAt: -1 })
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
        }).sort({ createdAt: -1 })
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
        }).sort({ createdAt: -1 });


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



export function generatePDF(data, isNew) {

    return new Promise(async (resolve, reject) => {
        try {
            let dataa = [
                [{ text: '#', border: [false, true, false, true] }, { text: 'Item', border: [false, true, false, true] }, { text: 'Price', border: [false, true, false, true] }, { text: 'Quantity', alignment: 'center', border: [false, true, false, true] }, { text: 'Total', border: [false, true, false, true] }],
            ];

            for (let i = 0; i < data.order.length; i++) {
                let product = data.order[i].product;
                const response = await axios.get(data.order[i].product.thumbnail, { responseType: 'arraybuffer' });
                const base64Data = await Buffer.from(response.data, 'binary').toString('base64');
                dataa.push([{ image: `data:image/jpeg;base64,${base64Data}`, border: [false, true, false, true], width: 50, height: 50 }, { text: product.productName, border: [false, true, false, true] }, { text: "₹" + product.amount, border: [false, true, false, true] }, { text: data.order[i].quantity, alignment: 'center', border: [false, true, false, true] }, { text: "₹" + data.order[i].total, border: [false, true, false, true] }])
            }

            let invoiceNo = ''

            if (isNew) {
                const invoice = new Invoice({
                    user: data.user,
                    order: data.order.map(order => order._id),
                    total: data.total,
                    address: data.address
                });
                await invoice.save();
                invoiceNo = invoice._id
            } else {
                invoiceNo = data._id
            }


            const documentDefinition = {
                content: [
                    {
                        fontSize: 11,
                        table: {
                            widths: ['50%', '50%'],
                            body: [
                                [{ text: 'Status: Paid', border: [false, false, false, true], margin: [-5, 0, 0, 10] }, { text: 'Invoice #' + invoiceNo, alignment: 'right', border: [false, false, false, true], margin: [0, 0, 0, 10] }]
                            ]
                        }
                    },
                    {
                        layout: 'noBorders',
                        fontSize: 11,
                        table: {
                            widths: ['50%', '50%'],
                            body: [
                                [{ text: 'fastkart.com', margin: [0, 10, 0, 0] }, { text: 'Invoice date: ' + data.createdAt, alignment: 'right', margin: [0, 10, 0, 0] }],
                                [' ', ' '],
                                ['123 Fifth Avenue, New York,NY 10160', ' '],
                                ['contact@info.com', ' '],
                                ['929-242-6868', ' ']
                            ]
                        }
                    },
                    {
                        fontSize: 11,
                        table: {
                            widths: ['50%', '50%'],
                            body: [
                                [{ text: ' ', border: [false, false, false, true], margin: [0, 0, 0, 10] }, { text: 'Payment amount: ₹' + data.total, alignment: 'right', border: [false, false, false, true], margin: [0, 0, 0, 10] }]
                            ]
                        }
                    },
                    {
                        layout: 'noBorders',
                        fontSize: 11,
                        table: {
                            widths: ['100%'],
                            body: [
                                [{ text: 'User details:', margin: [0, 10, 0, 0] }],
                                [' '],
                                ['Name: ' + data.address.name],
                                ['Phone: ' + data.address.phoneNumber],
                                ['Email: ' + data.address.email],
                                ['Address: ' + data.address.address],
                                ['City: ' + data.address.city + ' - ' + data.address.zip],
                                ['State: ' + data.address.state],
                                ['Country: ' + data.address.country],

                            ]
                        }
                    },
                    {
                        fontSize: 11,
                        table: {
                            widths: ['11%', '50%', '13%', '13%', '13%'],
                            body: dataa
                        }
                    },
                    {
                        layout: 'noBorders',
                        fontSize: 11,
                        margin: [0, 0, 5, 0],
                        table: {
                            widths: ['88%', '12%'],
                            body: [
                                [{ text: 'Subtotal:', alignment: 'right', margin: [0, 5, 0, 0] }, { text: '₹' + data.total, margin: [0, 5, 0, 0] }],
                                [{ text: 'Tax %:', alignment: 'right' }, '₹0.00'],
                            ]
                        }
                    },
                    {
                        fontSize: 11,
                        table: {
                            widths: ['88%', '12%'],
                            body: [
                                [{ text: 'Total:', alignment: 'right', border: [false, false, false, true], margin: [0, 0, 0, 10] }, { text: '₹' + data.total, border: [false, false, false, true], margin: [0, 0, 0, 10] }]
                            ]
                        }
                    },
                ]
            };


            console.log(documentDefinition)
            // Create PDF document
            const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
            pdfDocGenerator.getBuffer((buffer) => {
                console.log(buffer);
                resolve(buffer);
            });
        } catch (err) {
            reject(err);
        }
    })




}



export const sendInvoice = async (pdfStream, email) => {

    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const mailOptions = {
            from: 'recoverid166@gmail.com',
            to: email,
            subject: 'Invoice',
            attachments: [
                {
                    filename: 'invoice.pdf',
                    content: pdfStream,
                    encoding: 'base64'
                }
            ],
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
                    <p>Your order has been successfully placed.</p>
                    <p>We'r start to proccess your order, and Here your invoice.</p>

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

export const order_filter = async (status, order_time, user) => {
    try {
        let query = { user: user };

        if (order_time) {
            if (order_time == 'last_30') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                query['createdAt'] = { $gte: thirtyDaysAgo };
            } else {
                const startOfYear = new Date(order_time, 0, 1);
                const endOfYear = new Date(order_time + 1, 0, 1);
                query['createdAt'] = { $gte: startOfYear, $lt: endOfYear };
            }
        }

        if (status) {
            const selected_status = status === 'Delivered' ? 'Delivered' : status === 'Returned' ? 'Returned' : 'Out for delivery';

            if (selected_status === 'Returned')
                query['is_returned'] = true;
            else
                query['delivery_status'] = selected_status;
        }

        console.log(query)

        const orders = await Orders.find(query).populate({
            path: 'product'
        }).populate({
            path: 'user'
        }).populate({
            path: 'delivery_address'
        }).sort({ createdAt: -1 });


        console.log(orders)
        return orders;
    } catch (error) {
        throw error.message;
    }
}
