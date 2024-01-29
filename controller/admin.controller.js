import jwt from 'jsonwebtoken'
import { db } from "../model/product.model.js";
import { config } from 'dotenv';

config();

export const adminLogin = (username, password) => {
    return new Promise((resolve, reject) => {
        console.log(process.env.SECRET_KEY);

        db.get('SELECT * FROM admin_users WHERE usernaem = ? AND password = ?', [username, password], function (err, result) {
            if (err) {
                return reject(err);
            }

            const token = jwt.sign({ id: result.id }, process.env.ADMIN_SECRET_KEY);

            resolve(token);
        })
    });
};

export const admin = (cookie) => {
    return new Promise((resolve, reject) => {

        try {
            const claims = jwt.verify(cookie, process.env.ADMIN_SECRET_KEY);
            if (!claims) {
                return reject("unauthenticated");
            }
            db.get('SELECT * FROM admin_users WHERE id = ?', [claims.id], (err, res) => {
                if (err) {
                    return reject("unauthenticated");
                }
                const { password, ...data } = res
                resolve(data);
            });

        } catch (e) {
            return reject("unauthenticated");
        }
    });
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
    console.log(admin_token)
    if (admin_token) {
        const claims = jwt.verify(admin_token, process.env.ADMIN_SECRET_KEY);
        console.log(claims)
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