const express = require('express');
const app = express();
require('dotenv').config();

app.listen(process.env.PORT, () => console.log(`> Server is running on http://localhost:${process.env.PORT}/`))

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');
const {
    getConnection,
    releaseConnection,
} = require('./middlewares/connectionPoolHandler');
const {
    errorHandler
} = require('./middlewares/errorHandler');

app.use(express.json());
app.use(getConnection);

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', categoryRouter);
app.use('/likes', likeRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);

app.use(releaseConnection);
app.use(errorHandler);