import { Cart } from "../model/cart.model.js";
// import { db } from "../model/product.model.js";


let sql = {
    SELECT_CART: "SELECT * FROM cart_list WHERE user_id = ? AND ordered = ? AND returned = 0",
    INSERT_CART: "INSERT INTO cart_list (product_id, productName, price, quantity, user_id, total, ordered, product_qty, returned) VALUES (?,?, ?,?, ?,?, ?, ?, 0)",
    DELETE_CART_ITEM: "DELETE FROM cart_list WHERE id = ?",
    UPDATE_QTY: "UPDATE cart_list SET quantity = ?, total=? WHERE id = ?",
    UPDATE_TO_ORDER: "UPDATE cart_list SET ordered = 1 where user_id = ?",
    SELECT_ORDERED: "SELECT * FROM cart_list WHERE order_id = ? AND returned = 0",
    UPDATE_ORDER_ID: `UPDATE cart_list SET order_id = ? WHERE user_id = ? AND ordered = 1 AND order_id IS NULL`,
}

export const getCartItems = async (user_id) => {

    // return new Promise((resolve, reject) => {
    //     db.all(sql.SELECT_CART, [user_id, orderd], (err, result) => {
    //         if (err) {
    //             return reject(err);
    //         }
    //         resolve(result);
    //     });
    // });

    try {
        const cart = await Cart.find({ user: user_id }).populate('product').populate('user');
        return cart
    } catch (error) {
        throw error
    }

}

export const addItemToCart = async (product_id, quantity, user_id,) => {

    // return new Promise((resolve, reject) => {
    //     db.run(sql.INSERT_CART, [product_id, productName, price, quantity, user_id, quantity * price, ordered, product_qty], function (err, result) {
    //         if (err) {
    //             return reject(err);
    //         }

    //         resolve({ success: true, message: "Cart added successfully", id: this.lastID });
    //     })
    // })

    try {
        // Create a new cart item
        const cart = new Cart({
            product: product_id, // Assuming product_id is the ObjectId of the product
            user: user_id, // Assuming user_id is the ObjectId of the user
            quantity: quantity,
        });

        // Save the cart item
        await cart.save();

        console.log('Cart'.cart)

        // Populate the product field to access the product details
        await cart.populate('product');

        // Access the populated product details
        const populatedCart = cart; // Convert cart to a plain JavaScript object
        console.log(populatedCart);
        const product = populatedCart.product;

        // Calculate the total price for the cart item
        const total = product.amount * quantity;

        // Update the total field in the cart item
        cart.total = total;

        // Save the updated cart item
        console.log(cart);;
        await cart.save();

        // Return the cart item
        return cart;
    } catch (error) {
        console.log(error);
        throw error;
    }


}

export const deleteItemFromCart = async (id) => {


    // return new Promise((resolve, reject) => {
    //     db.run(sql.DELETE_CART_ITEM, [id], (err, result) => {
    //         if (err) {
    //             return reject(err);
    //         }

    //         resolve({ success: true, message: "deleted successfully" });
    //     })
    // });

    try {

        return await Cart.deleteOne({ _id: id })
    } catch (e) {
        throw e;
    }

}

export const updateItemQuantityCart = async (id, quantity, total) => {

    // return new Promise((resolve, reject) => {
    //     db.run(sql.UPDATE_QTY, [quantity, total, id], (err, result) => {
    //         if (err) {
    //             return reject(err);
    //         }
    //         resolve({ success: true, message: "updated successfully" });
    //     });
    // });

    try {
        const cart = await Cart.findByIdAndUpdate(id, { $set: { quantity: quantity, total: total } });

        return { success: true, message: "updated successfully" };
    } catch (error) {
        throw { success: false, message: error.message };
    }

}

// export const updateToOrdered = (user_id) => {


//     return new Promise((resolve, reject) => {
//         db.run(sql.UPDATE_TO_ORDER, [user_id], (err, result) => {
//             if (err) {
//                 return reject(err);
//             }
//             let qty = [];
//             getCartItems(user_id, 1).then(async (items) => {
//                 await items.forEach((item) => {
//                     qty.push({ quantity: item.quantity, name: item.productName })
//                 })
//                 resolve({ success: true, message: "updated successfully", items: qty });
//             });
//         });
//     });

// }

// export const addOrderId = (user_id, order_id) => {
//     console.log(user_id, order_id);
//     return new Promise((resolve, reject) => {
//         db.run(sql.UPDATE_ORDER_ID, [order_id, user_id], (err, res) => {
//             if (err) {
//                 return reject(err);
//             }
//             resolve({ success: true, message: "updated successfully" })
//         });
//     });
// }


// export const getOrderedItems = (order_id) => {

//     return new Promise((resolve, reject) => {
//         db.all(sql.SELECT_ORDERED, [order_id], (err, res) => {
//             if (err) {
//                 return reject(err);
//             }
//             resolve(res);
//         });
//     });

// }

// export const getReturnedProducts = (order_id) => {
//     return new Promise((resolve, reject) => {
//         db.all("SELECT * FROM cart_list WHERE order_id = ? AND returned = 1", [order_id], (err, res) => {
//             console.log(res)
//             if (err) { return reject(err); }

//             resolve(res);
//         })
//     })
// }