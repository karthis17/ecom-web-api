import mongoose from "mongoose";

export const Orders = mongoose.model('Order', {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    total: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    payment_id: String,
    delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    delivery_status: { type: String, default: 'Processing' },
    tracking_id: { type: String, },
    is_returned: { type: Boolean, default: false },
    return_date: { type: Date, },
    createdAt: { type: Date, default: Date.now() },
    resone: String,
    returnStatus: { type: String, default: 'Processing' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
});