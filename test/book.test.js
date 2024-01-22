const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');

describe('도서 조회', () => {
    describe('정상 요청', () => {
        it('GET /api/books?categoryId&recent&limit&page 요청 시 도서 목록 반환', (done) => {
            request(app)
                .get('/api/books?limit=2&page=1')
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);

                    assert(Array.isArray(res.body.books));

                    assert(res.body.pagination.hasOwnProperty('currentPage'));
                    assert(res.body.pagination.hasOwnProperty('totalCount'));

                    return done();
                });
        });
    });

    describe('limit 누락', () => {
        it('GET /api/books?categoryId&recent&page 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .get('/api/books?page=1')
                .expect(StatusCodes.BAD_REQUEST, done);
        });
    });

    describe('page 누락', () => {
        it('GET /api/books?categoryId&recent&limit 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .get('/api/books?limit=2')
                .expect(StatusCodes.BAD_REQUEST, done);
        });
    });

    describe('없는 페이지', () => {
        it('GET /api/books?categoryId&recent&limit&page 요청 시 존재하지 않는 페이지임을 알림', (done) => {
            request(app)
                .get('/api/books?limit=2&page=10')
                .expect(StatusCodes.NOT_FOUND)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, "존재하지 않는 페이지입니다.");

                    return done();
                });
        });
    });
});

describe('도서 개별 조회', () => {
    describe('정상 요청', () => {
        it('GET /api/books/{bookId} 요청 시 해당 도서 정보 반환', (done) => {
            request(app)
                .get('/api/books/1')
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.id, 1);

                    return done();
                });
        });
    });

    describe('없는 도서 요청', () => {
        it('GET /api/books/{bookId} 요청 시 존재하지 않는 도서임을 알림', (done) => {
            request(app)
                .get('/api/books/10')
                .expect(StatusCodes.NOT_FOUND)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, "존재하지 않는 도서입니다.");

                    return done();
                });
        });
    });
});