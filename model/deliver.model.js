import mongoose from "mongoose";

export const Address = mongoose.model("Address", {
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    phoneNumber: String,
    zip: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});