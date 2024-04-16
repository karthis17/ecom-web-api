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


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "http://localhost:3000", "*", "https://ecom-web-lovat.vercel.app"]
}));

// Enable CORS for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://ecom-web-lovat.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cookieParser());


app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/deliver-details", dtlRouter);
app.use("/api/reviews", reviewRouter);
app.get("/del", (req, res) => {
    res.clearCookie('user');
    res.send("hi")
})

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

mongoose.connect("mongodb+srv://karthirs602:adminkarthi@cluster0.camz86p.mongodb.net/fastkart?retryWrites=true&w=majority").then((res) => {
    app.listen(port, (req, res) => {
        console.log(`listening on port ${port} on http://localhost:${port}`);
    });
}).catch((err) => console.log(err));