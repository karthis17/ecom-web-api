import express from 'express';
const payment_route = express.Router();
import { createOrder, verifyRazorpaySignature } from '../controller/payment.controller.js';
import { authonticatedUser } from '../controller/user.controller.js';
import { addItemToOrder } from '../controller/order.controller.js';
import { Address } from '../model/deliver.model.js';

payment_route.post('/createOrder', authonticatedUser, createOrder);


payment_route.post('/verifyPayment', authonticatedUser, async (req, res) => {
    const { orderId, paymentId, signature, address } = req.body;

    // Verify the payment signature
    const isValidSignature = verifyRazorpaySignature(orderId, paymentId, signature);


    if (isValidSignature) {

        const add = await Address.findById(address._id);

        if (add) {
            await addItemToOrder(req.user, orderId, address._id);
        } else {
            delete address['_id'];
            const delAdd = new Address(address);
            await delAdd.save();

            await addItemToOrder(req.user, orderId, delAdd._id);
        }


        res.status(200).json({ success: true, message: 'Payment signature verified successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature.' });
    }
});


export default payment_route;
