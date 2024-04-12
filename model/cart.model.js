import mongoose from "mongoose";


export const Cart = mongoose.model("Cart", {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, default: 1 },
    total: Number,

    createdAt: { type: Date, default: Date.now() },
});