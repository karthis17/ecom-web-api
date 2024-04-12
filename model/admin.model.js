import mongoose from "mongoose";

export const Admin = mongoose.model('Admin', {
    username: String,
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date() }
})