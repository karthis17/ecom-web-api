import mongoose from "mongoose";

export const User = mongoose.model('User', {
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    otp: Number,
    otp_epr: { type: Date },
    createdAt: { type: Date, default: Date() }
})