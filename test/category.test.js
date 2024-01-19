const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');

describe('카테고리 전체 조회', () => {
    it('GET /category 요청 시 카테고리 전체 목록 반환', (done) => {
        request(app)
            .get('/category')
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                assert(Array.isArray(res.body));

                res.body.forEach(category => {
                    assert(category.hasOwnProperty('id'));
                    assert(category.hasOwnProperty('name'));
                });

                return done();
            });
    });
});