import express from 'express';
import cors from 'cors';
import productRouter from './router/prodect.router.js';
import userRouter from './router/user.router.js';
import cartRouter from './router/cart.router.js';
import orderRouter from './router/order.router.js';
import dtlRouter from './router/delivery.router.js';
import reviewRouter from './router/review.router.js';
import { admin, adminLogin } from './controller/admin.controller.js';
import cookieParser from 'cookie-parser';


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "http://localhost:65347/"]
}));
app.use(cookieParser());


app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/deliver-details", dtlRouter);
app.use("/api/reviews", reviewRouter);


app.post('/admin', function (req, res) {
    adminLogin(req.body.username, req.body.password).then(ress => {

        res.cookie("admin", ress, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.send({
            success: true,
            message: 'Successfully logged in'
        })
    }).catch(err => {
        res.status(404).send(err);
    });
});

app.get('/user', (req, res) => {
    admin(req.cookies['admin']).then(user => {
        res.send(user);
    }).catch(err => {
        res.status(401).send(err);
    });
});

app.listen(port, (req, res) => {
    console.log('listening om port: ' + port + " http://localhost:" + port);
});