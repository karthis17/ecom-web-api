import Razorpay from 'razorpay';
import dotenv from 'dotenv'
dotenv.config();
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
import { createHmac } from 'crypto';


const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});



export const createOrder = async (req, res) => {
    try {

        // Calculate the amount (assuming it's in paisa for INR)
        const amount = req.body.amount * 100;
        const address = req.body.address;

        // Create options for Razorpay order
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        };

        // Create order using Razorpay
        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {


                return res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: RAZORPAY_ID_KEY,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: "8567345632",
                    name: "Sandeep Sharma",
                    email: "sandeep@gmail.com",
                    address
                });
            } else {
                console.error(err);
                return res.status(400).send({ success: false, msg: 'Something went wrong!' });
            }
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    }
};



export function verifyRazorpaySignature(orderId, paymentId, signature) {
    // Concatenate order ID and payment ID
    const data = orderId + "|" + paymentId;

    // Create HMAC-SHA256 hash using secret key
    const hmac = createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
    hmac.update(data);

    // Generate hexadecimal encoded signature
    const generatedSignature = hmac.digest('hex');

    // Compare generated signature with received signature
    return signature === generatedSignature;
}




