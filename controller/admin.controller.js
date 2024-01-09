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

            const token = jwt.sign({ id: result.id }, process.env.SECRET_KEY);

            resolve(token);
        })
    });
};

export const admin = (cookie) => {
    return new Promise((resolve, reject) => {

        try {
            const claims = jwt.verify(cookie, process.env.SECRET_KEY);
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