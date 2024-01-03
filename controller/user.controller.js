import { db } from "../model/product.model.js";
import bcrypt from "bcrypt";

let sql = {
    INSERT_USER: "INSERT INTO user (name, email, password) VALUES(?, ?, ?)",
    SELECT_USER: "SELECT * FROM user WHERE email = ? OR id = ?",
}

const getUser = (email) => {
    return new Promise((resolve, reject) => {
        db.get(sql.SELECT_USER, [email], (err, result) => {
            if (err) {
                return reject(err);
            } else {
                console.log(result, "hiii");
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
                message: 'User already exists.'
            };
        }
        return new Promise((resolve, reject) => {
            db.run(sql.INSERT_USER, [name, email, hashPassword], function (err) {
                if (err) {
                    return reject(err);
                } else {
                    db.get(sql.SELECT_USER, [this.lastID, this.lastID], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve({
                            success: true,
                            ...result
                        });
                    });

                }
            });
        });
    } catch (error) {
        console.error('Error in registration:', error);
        throw error;
    }
}

export const login = async (email, password) => {
    try {
        const existingUser = await getUser(email);
        console.log(existingUser, "hi", email)
        // Check if the user with the given email already exists
        if (!existingUser) {
            return {
                success: false,
                message: 'Invalid email id'
            }
        }
        const isValid = await bcrypt.compare(password, existingUser.password);

        if (!isValid) {
            return {
                success: false,
                message: "Invalid password"
            }
        }

        return {
            success: true,
            ...existingUser
        };


    } catch (error) {
        throw new Error(error);
    }

}
