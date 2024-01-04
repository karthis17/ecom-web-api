import { Router } from "express";
import { register, login } from "../controller/user.controller.js";


const router = new Router();


router.post('/register', (req, res) => {
    register(req.body.name, req.body.email, req.body.password).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(404).send(err)
    });

});

router.post('/login', (req, res) => {
    login(req.body.email, req.body.password).then((user) => {

        res.send(user)
    }).catch((err) => {
        res.status(404).send(err)
    });

});




export default router;
