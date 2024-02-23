const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;

const tokenRouter = require('./src/routes/token.route');
const userRouter = require('./src/routes/user.route');
const bookRouter = require('./src/routes/book.route');
const categoryRouter = require('./src/routes/category.route');
const likeRouter = require('./src/routes/like.route');
const cartRouter = require('./src/routes/cart.route');
const orderRouter = require('./src/routes/order.route');
const { errorHandler } = require('./src/middlewares/errorHandler.middleware');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/refresh', tokenRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/category', categoryRouter);
app.use('/api/likes', likeRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.use(errorHandler);

app.listen(port, () =>
    console.log(`> Server is running on http://localhost:${port}/`)
);

module.exports = app;