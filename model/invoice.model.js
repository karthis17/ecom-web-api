import mongoose from "mongoose";


export const Invoice = mongoose.model("Invoice", {
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    total: Number,
    address: {},
    createdAt: { type: Date, default: Date.now() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});