const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const userRouter = require('./src/routes/users');
const bookRouter = require('./src/routes/books');
const categoryRouter = require('./src/routes/category');
const likeRouter = require('./src/routes/likes');
const cartRouter = require('./src/routes/carts');
const orderRouter = require('./src/routes/orders');
const { errorHandler } = require('./src/middlewares/errorHandler.middleware');

app.use(express.json());

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);

app.use(errorHandler);

app.listen(port, () =>
    console.log(`> Server is running on http://localhost:${port}/`)
);