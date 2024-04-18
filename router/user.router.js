import { Router } from "express";
import { register, login, getUserData, forgotPassword, resetPassword } from "../controller/user.controller.js";


const router = new Router();

const createCookie = (response, data) => {
    return response.cookie("user", data, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: (24 * 60 * 60 * 1000) * 15
    });
}


router.post('/register', (req, res) => {
    console.log(req.body)
    register(req.body.name, req.body.email, req.body.password).then((result) => {

        createCookie(res, result.token);

        res.send(result)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.post('/login', (req, res) => {
    login(req.body.email, req.body.password).then((user) => {

        console.log(createCookie(res, user.token))
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
});

router.get('/logout', (req, res) => {
    res.cookie("user", " ", { expires: new Date(0) });

    res.send({ success: true, message: "User logged out" });

});

router.post('/forgot-password', (req, res) => {
    forgotPassword(req.body.email).then((ress) => { res.send(ress) }).catch((err) => { res.status(500).send(err) });
});


router.post('/reset-password', (req, res) => {
    console.log(req.body)
    resetPassword(req.body.email, req.body.password).then((ress) => { res.send(ress) }).catch((err) => { res.status(500).send(err) });
})

export default router;
