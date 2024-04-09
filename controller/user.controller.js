import { db } from "../model/product.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
import nodemailer from 'nodemailer'

config();

let sql = {
    INSERT_USER: "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
    SELECT_USER: "SELECT * FROM user WHERE email = ? OR id = ?",
    UPDATE: 'UPDATE user SET password = ? WHERE email = ?'
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

export const forgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        const existingUser = await getUser(email);

        if (!existingUser) {
            return resolve({
                success: false,
                message: 'Invalid email id',
                err: 'email'
            })
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const OTP = Math.floor(1000 + Math.random() * 9000); // Generate OTP


        const mailOptions = {
            from: 'recoverid166@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password OTP</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 20px;
                }
                a {
                    color: rgb(255, 89, 0);
                    text-decoration: none;

                }
            </style>
            </head>
            <body>
            <div class="container">
                <p>You have requested to reset your password. Use the OTP below to verify your identity:</p>
                <p class="otp">${OTP}</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
                <a href="https://replica-gifts-frontend.vercel.app/" target="_blank">Replica Gifts</a>
            </div>
            </body>
            </html>

        `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return reject({ error: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                return resolve({ success: true, message: info.response, opt: OTP });
            }
        });

    })
}

export const resetPassword = async (email, newPassword) => {


    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    console.log(hashPassword);

    return new Promise((resolve, reject) => {
        db.run(sql.UPDATE, [hashPassword, email], (err) => {
            console.log(hashPassword, email);
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve({ success: true, message: 'password updated successfully' });
        });
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
