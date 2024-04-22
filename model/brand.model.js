import mongoose from "mongoose";

export const Brand = mongoose.model('Brand', {
    name: String,
    thumbnail: { type: String, required: true },
    category: [{ type: String, required: true }]
})