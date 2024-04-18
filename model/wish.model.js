import mongoose from "mongoose";


export const Wish = mongoose.model("Wish", {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    createdAt: { type: Date, default: Date.now() }
});