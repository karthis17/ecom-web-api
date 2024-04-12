// import { db } from "../model/product.model.js";
import { Product } from "../model/product.model.js";
import { Review } from "../model/review.model.js";

const sql = {
    INSERT_REVIEW: "INSERT INTO product_reviews(product_id, comment, rating, name) VALUES(?,?,?,?)",
    SELECT_REVIEW: "SELECT * FROM product_reviews WHERE product_id = ?"
}

export const addReivew = async (product, comment, rating, user) => {

    try {
        const review = new Review({
            product, comment, rating, user
        });

        await review.save();

        const review_all = await Review.find({ product });

        await Product.updateOne({ _id: product }, { rating: calculateAverageRating(review_all), noOfRatings: review_all.length }).exec();

        return { success: true, message: "success added", review };
    } catch (error) {
        console.log(error);
        throw error.message;
    }

};


function calculateAverageRating(reviews) {
    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating;
}

export const getReviews = async (product) => {

    try {
        const review = await Review.find({ product }).populate({ path: 'user', select: '-password' });
        console.log(review)
        return review;
    } catch (error) {
        console.error(error);
        throw error;
    }

};