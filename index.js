import express from 'express';
import cors from 'cors';
import productRouter from './router/prodect.router.js';
import userRouter from './router/user.router.js';
import cartRouter from './router/cart.router.js';
import orderRouter from './router/order.router.js';
import dtlRouter from './router/delivery.router.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/deliver-details", dtlRouter);

app.listen(port, (req, res) => {
    console.log('listening om port: ' + port + " http://localhost:" + port);
});