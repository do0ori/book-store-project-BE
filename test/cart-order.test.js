const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');
const { faker } = require('@faker-js/faker');
require('dotenv').config();
const token = process.env.TEST_TOKEN

let itemId;
let insertId;

// cart test
describe('장바구니 담기', () => {
    it('POST /api/cart 요청 시 장바구니 record 추가', (done) => {
        request(app)
            .post('/api/cart')
            .set("Authorization", `Bearer ${token}`)
            .send({ bookId: 4, quantity: 1 })
            .expect(StatusCodes.CREATED)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.affectedRows, 1);
                itemId = res.body.insertId;

                return done();
            });
    });

    it('POST /api/cart 요청 시 같은 item도 따로 장바구니 record 추가', (done) => {
        request(app)
            .post('/api/cart')
            .set("Authorization", `Bearer ${token}`)
            .send({ bookId: 4, quantity: 1 })
            .expect(StatusCodes.CREATED)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body.affectedRows, 1);
                insertId = res.body.insertId;

                return done();
            });
    });
});

describe('(선택한) 장바구니 목록 조회', () => {
    it('GET /api/cart 요청 시 장바구니 목록 반환', (done) => {
        request(app)
            .get('/api/cart')
            .set("Authorization", `Bearer ${token}`)
            .send({ selected: [insertId] })
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                assert.strictEqual(res.body[0].itemId, insertId);

                return done();
            });
    });
});

describe('장바구니 삭제', () => {
    describe('정상 요청', () => {
        it('DELETE /api/cart/{itemId} 요청 시 해당 아이템 record 삭제', (done) => {
            request(app)
                .delete(`/api/cart/${insertId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.affectedRows, 1);

                    return done();
                });
        });
    });

    describe('중복된 요청', () => {
        it('DELETE /api/cart/{itemId} 요청 시 이미 처리된 요청임을 알림', (done) => {
            request(app)
                .delete(`/api/cart/${insertId}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(StatusCodes.CONFLICT)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, "이미 처리된 요청입니다.");

                    return done();
                });
        });
    });
});

const sex = faker.person.sexType();
const firstName = faker.person.firstName(sex);
const lastName = faker.person.lastName();
const recipient = faker.person.fullName({ firstName, lastName });
const contact = faker.phone.number();
const address = faker.location.streetAddress();
fakeUserDelivery = { address, recipient, contact };

let orderId;

// order test
describe('결제 주문하기', () => {
    it('POST /api/orders 요청 시 주문 transaction 실행', (done) => {
        request(app)
            .post('/api/orders')
            .set("Authorization", `Bearer ${token}`)
            .send({
                items: [{ cartItemId: itemId, bookId: 4, quantity: 1 }],
                delivery: fakeUserDelivery,
                totalPrice: 35000,
                totalQuantity: 1,
                firstBookTitle: "마탑주 라푼젤"
            })
            .expect(StatusCodes.CREATED, done);
    });
});

describe('주문 목록(내역) 조회', () => {
    it('GET /api/orders 요청 시 장바구니 목록 반환', (done) => {
        request(app)
            .get('/api/orders')
            .set("Authorization", `Bearer ${token}`)
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                assert(Array.isArray(res.body));

                orderId = res.body[res.body.length - 1].orderId;

                return done();
            });
    });
});

describe('주문 상세 상품 조회', () => {
    it('GET /api/orders/{orderId} 요청 시 이미 처리된 요청임을 알림', (done) => {
        request(app)
            .get(`/api/orders/${orderId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                assert(Array.isArray(res.body));

                res.body.forEach(item => {
                    assert(item.hasOwnProperty('bookId'));
                    assert(item.hasOwnProperty('title'));
                    assert(item.hasOwnProperty('author'));
                    assert(item.hasOwnProperty('price'));
                    assert(item.hasOwnProperty('quantity'));
                });

                return done();
            });
    });
});