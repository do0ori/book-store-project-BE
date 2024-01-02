const express = require('express');
const app = express();
require('dotenv').config();

app.listen(process.env.PORT, () => console.log(`> Server is running on http://localhost:${process.env.PORT}/`))

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use(express.json());
app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/likes', likeRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);