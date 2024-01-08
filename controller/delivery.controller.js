import { db } from "../model/product.model.js";

const sql = {
    INSERT_DTL: "INSERT INTO  delivery_deatails(address, phone, email, user_id) VALUES(?,?,?,?)",
    SELECT_DTL: "SELECT * FROM  delivery_deatails WHERE user_id = ?"
}

export const getDeliverDtl = (user_id) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_DTL, [user_id], function (err, result) {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })

}


export const addDtl = (user_id, address, phone, email) => {
    console.log(user_id, address, phone, email)

    return new Promise((resolve, reject) => {
        db.run(sql.INSERT_DTL, [address, phone, email, user_id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ success: true, message: "dtl updated successfully", id: this.lastID });
        })
    })

}