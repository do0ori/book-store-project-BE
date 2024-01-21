const express = require('express');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;

const userRouter = require('./src/routes/user.route');
const bookRouter = require('./src/routes/book.route');
const categoryRouter = require('./src/routes/category.route');
const likeRouter = require('./src/routes/like.route');
const cartRouter = require('./src/routes/cart.route');
const orderRouter = require('./src/routes/order.route');
const { errorHandler } = require('./src/middlewares/errorHandler.middleware');

app.use(cookieParser());
app.use(express.json());

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