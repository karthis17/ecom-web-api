import mongoose from "mongoose";

export const Product = mongoose.model("Product", {
    productName: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    thumbnail: String,
    description: String,
    quantity: Number,
    discount: Number,
    rating: Number,
    about: [],
    amount: Number,
    category: String,
    specification: {},
    noOfRatings: Number,
    createdAt: { type: Date, default: Date.now() },
});
