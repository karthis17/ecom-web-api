import jwt from 'jsonwebtoken'
// import { db } from "../model/product.model.js";
import { config } from 'dotenv';
import { Admin } from '../model/admin.model.js';

config();

export const adminLogin = async (username, password) => {
    try {

        const admin = await Admin.findOne({ username: username, password: password });

        if (!admin) {
            throw { success: false, message: "Invalid credentials." };
        } else {
            const token = jwt.sign({ id: admin._id }, process.env.ADMIN_SECRET_KEY);
            return token;
        }

    } catch (e) {
        throw e;
    }
};

export const admin = async (cookie) => {


    try {
        const claims = jwt.verify(cookie, process.env.ADMIN_SECRET_KEY);
        if (!claims) {
            throw "unauthenticated";
        }

        const admin = await Admin.findById(claims.id).select('-password');

        return admin;

    } catch (e) {
        throw "unauthenticated";
    }

}

export const authonticatedAdmin = (req, res, next) => {
    const token = req.cookies["admin"];

    if (token) {
        const claims = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
        // console.log(claims)
        if (!claims)
            res.status(400).send({ success: false, message: "Unauthorized" });
        else next();
    } else {
        res.status(401).send({ message: "Unauthenticated admin", success: false });
    }

}

export const adminAccess = (req, res, next) => {
    const token = req.cookies["user"];
    const admin_token = req.cookies["admin"];
    if (admin_token) {
        const claims = jwt.verify(admin_token, process.env.ADMIN_SECRET_KEY);
        if (!claims) {
            res.status(400).send({ success: false, message: "Unauthorized" });
        } else {
            next()
        }
    } else if (token) {
        const claims_ = jwt.verify(token, process.env.SECRET_KEY);

        if (!claims_) {
            res.status(400).send({ success: false, message: "Unauthorized" });
        } else next()
    } else res.status(400).send({ success: false, message: "Unauthorized" });
}