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
import mongoose from 'mongoose';
import wishRouter from './router/wish.router.js'
import brandRouter from './router/brand.js'
import payment_route from './router/order.js';
import invoice from './router/invoice.js';
import chart from './router/chart.js';


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "*", "https://ecom-web-lovat.vercel.app"],

    exposedHeaders: ["Set-cookie"],
}));


app.use(cookieParser({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "*", "https://ecom-web-lovat.vercel.app"]

}));


app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/deliver-details", dtlRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api", wishRouter);
app.use("/api", brandRouter);
app.use("/api/payment", payment_route);
app.use("/api/chart", chart);
app.use("/api/invoice", invoice);
app.get("/del", (req, res) => {
    res.clearCookie('user');
    res.send("hi")
})

app.post('/admin', function (req, res) {
    adminLogin(req.body.username, req.body.password).then(ress => {

        res.cookie("admin", ress, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
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

mongoose.connect("mongodb+srv://karthirs602:adminkarthi@cluster0.camz86p.mongodb.net/fastkart?retryWrites=true&w=majority").then((res) => {
    app.listen(port, (req, res) => {
        console.log(`listening on port ${port} on http://localhost:${port}`);
    });
}).catch((err) => console.log(err));