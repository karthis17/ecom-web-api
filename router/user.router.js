import { Router } from "express";
import { register, login, getUserData } from "../controller/user.controller.js";


const router = new Router();

const createCookie = (response, data) => {
    return response.cookie("user", data, {
        httpOnly: true,
        maxAge: (24 * 60 * 60 * 1000) * 15
    });
}


router.post('/register', (req, res) => {
    register(req.body.name, req.body.email, req.body.password).then((result) => {

        createCookie(res, result.token);

        res.send(result)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.post('/login', (req, res) => {
    login(req.body.email, req.body.password).then((user) => {
        createCookie(res, user.token);
        res.send(user)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.get('/get-user', (req, res) => {
    const token = req.cookies['user'];
    console.log('token', token);
    if (token) {

        getUserData(token).then((response) => {
            res.status(200).send(response);
        }).catch((err) => {
            res.status(404).send(err);
        });
    } else {
        res.status(404).send({ success: false, message: "Unauthorized" });
    }
})


export default router;
