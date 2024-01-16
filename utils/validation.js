const { body, param, query, validationResult } = require('express-validator');
const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

/**
 * Validation Result Handler
 */
const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new HttpError(StatusCodes.BAD_REQUEST, "Request input validation fails."));
    }
    next();
}

/*
 * Validation Chains
 */
const checkInt = (location, field, required = true) => required ? location(field).exists().isInt() : location(field).optional().isInt();

const checkPosInt = (location, field) => location(field).exists().isInt({ gt: 0 });

const checkEmail = (location, field) => location(field).exists().isEmail().withMessage('Invalid email address');

const checkPassword = (location, field, min) => location(field).exists().isLength({ min }).withMessage(`Password must be at least ${min} characters long`);

const checkBoolean = (location, field) => location(field).optional().isBoolean();

const checkPosIntArray = (location, field) => location(field).optional().isArray({ min: 1 }).custom(
    value => value.every(item => Number.isInteger(item) && item > 0)
);

const checkObjArray = (location, field) => location(field).exists().isArray({ min: 1 }).withMessage('Array cannot be empty').custom(
    value => value.every(item =>
        item.hasOwnProperty('cartItemId') && item.hasOwnProperty('bookId') && item.hasOwnProperty('quantity') &&
        Number.isInteger(item.cartItemId) && Number.isInteger(item.bookId) && Number.isInteger(item.quantity)
    )
);

const checkObject = (location, field) => location(field).exists().isObject().custom(
    value => value.hasOwnProperty('address') && value.hasOwnProperty('recipient') && value.hasOwnProperty('contact')
);

const checkString = (location, field) => location(field).exists().isString();

/*
 * Grouped Validation Chains
 */
const emailPasswordValidation = [
    checkEmail(body, 'email'),
    checkPassword(body, 'password', 8),
    checkValidationResult
];

const emailValidation = [
    checkEmail(body, 'email'),
    checkValidationResult
];

const pagingValidation = [
    checkInt(query, 'categoryId', false),
    checkBoolean(query, 'recent'),
    checkPosInt(query, 'limit'),
    checkPosInt(query, 'page'),
    checkValidationResult
];

const bookIdValidation = [
    checkInt(param, 'bookId'),
    checkValidationResult
];

const cartItemValidation = [
    checkInt(body, 'bookId'),
    checkPosInt(body, 'quantity'),
    checkValidationResult
];

const selectedValidation = [
    checkPosIntArray(body, 'selected'),
    checkValidationResult
];

const itemIdValidation = [
    checkInt(param, 'itemId'),
    checkValidationResult
];

const orderRequestValidation = [
    checkObjArray(body, 'items'),
    checkObject(body, 'delivery'),
    checkPosInt(body, 'totalPrice'),
    checkPosInt(body, 'totalQuantity'),
    checkString(body, 'firstBookTitle'),
    checkValidationResult
];

const orderIdValidation = [
    checkInt(param, 'orderId'),
    checkValidationResult
];

/*
 * Binding request handler to corresponding validator
 */
const validator = {
    signUp: emailPasswordValidation,
    logIn: emailPasswordValidation,
    passwordResetRequest: emailValidation,
    resetPassword: emailPasswordValidation,

    getBooks: pagingValidation,
    getBookById: bookIdValidation,

    addToLikes: bookIdValidation,
    removeFromLikes: bookIdValidation,

    addToCart: cartItemValidation,
    getCartItems: selectedValidation,
    removeFromCart: itemIdValidation,

    submitOrder: orderRequestValidation,
    getOrderDetails: orderIdValidation
};

module.exports = validator;
