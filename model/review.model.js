import mongoose from "mongoose";

export const Review = mongoose.model('Review', {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number },
    comment: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});