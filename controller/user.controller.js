import { db } from "../model/product.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';

config();

let sql = {
    INSERT_USER: "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
    SELECT_USER: "SELECT * FROM user WHERE email = ? OR id = ?",
}

export const getUser = (email) => {
    return new Promise((resolve, reject) => {
        db.get(sql.SELECT_USER, [email, email], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export const register = async (name, email, password) => {
    try {
        const salt = await bcrypt.genSalt(5);
        const hashPassword = await bcrypt.hash(password, salt);

        // Check if the user with the given email already exists
        if (await getUser(email)) {
            return {
                success: false,
                message: 'User already exists.',
                err: 'email'
            };
        }
        return new Promise((resolve, reject) => {
            db.run(sql.INSERT_USER, [name, email, hashPassword], function (err) {
                if (err) {
                    return reject(err);
                } else {

                    const token = jwt.sign({ id: this.lastID, exp: Math.floor(Date.now() / 1000) + 7 * (24 * 60 * 60) }, process.env.SECRET_KEY);
                    console.log(token);
                    resolve({ success: true, token });
                }
            });
        });
    } catch (error) {
        console.error('Error in registration:', error);
        throw error;
    }
}

export const login = async (email1, password) => {
    try {
        const existingUser = await getUser(email1);
        const { id } = existingUser;
        // Check if the user with the given email already exists
        if (!existingUser) {
            return {
                success: false,
                message: 'Invalid email id',
                err: 'email'
            }
        }
        const isValid = await bcrypt.compare(password, existingUser.password);

        if (!isValid) {
            return {
                success: false,
                message: "Invalid password",
                err: 'password'
            }
        }

        const token = jwt.sign({ id }, process.env.SECRET_KEY);
        console.log(token, "shdi");

        return {
            success: true,
            token
        };


    } catch (error) {
        throw new Error(error);
    }

}


export const getUserData = (token) => {

    return new Promise((resolve, reject) => {
        console.log(token, "Asd")
        const claims = jwt.verify(token, process.env.SECRET_KEY);
        console.log(claims)
        if (!claims) {
            return reject({ success: false, message: "Unauthorized" });
        }


        db.get("SELECT id, name, email FROM user WHERE id = ?", [claims.id], (err, result) => {

            if (err) {
                return reject({ success: false, message: "Unauthorized" });
            }

            resolve(result);
        })


    })
}

export const authonticatedUser = (req, res, next) => {
    const token = req.cookies["user"];
    if (token) {
        const claims = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(claims)
        if (!claims) {
            res.status(400).send({ success: false, message: "Unauthorized" });
        } else {
            next()
        }
    } else {
        res.status(401).send({ success: false, message: "Unauthorized" });
    }

}