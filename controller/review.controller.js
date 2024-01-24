import { db } from "../model/product.model.js";

const sql = {
    INSERT_REVIEW: "INSERT INTO product_reviews(product_id, comment, rating, name) VALUES(?,?,?,?)",
    SELECT_REVIEW: "SELECT * FROM product_reviews WHERE product_id = ?"
}

export const addReivew = (product_id, comment, rating, user_name) => {

    return new Promise((resolve, reject) => {

        db.run(sql.INSERT_REVIEW, [product_id, comment, rating, user_name], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({
                success: true,
                message: "review successfully added",
                id: this.lastID
            });
        });
    });

};

export const getReviews = (product_id) => {

    return new Promise((resolve, reject) => {
        db.all(sql.SELECT_REVIEW, [product_id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });

};