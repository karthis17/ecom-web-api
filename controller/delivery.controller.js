import { Address } from "../model/deliver.model.js";
// import { db } from "../model/product.model.js";

const sql = {
    INSERT_DTL: "INSERT INTO  delivery_deatails(address, phone, email, user_id) VALUES(?,?,?,?)",
    SELECT_DTL: "SELECT * FROM  delivery_deatails WHERE user_id = ?"
}

export const getDeliverDtl = (user) => {

    try {
        const address = Address.find({ user });

        return address;

    } catch (error) {
        throw error;
    }


}


export const addDtl = async (address1) => {

    try {
        const address = new Address(address1);
        console.log(address);

        await address.save();

        return address;

    } catch (error) {
        console.error(error);
        throw error;
    }


}