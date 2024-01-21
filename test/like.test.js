const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();
const token = process.env.TEST_TOKEN

describe('좋아요 추가', () => {
    describe('정상 요청', () => {
        it('POST /api/likes/{bookId} 요청 시 좋아요 record 추가', (done) => {
            request(app)
                .post('/api/likes/1')
                .set("Authorization", `Bearer ${token}`)
                .expect(StatusCodes.CREATED)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.affectedRows, 1);

                    return done();
                });
        });
    });

    describe('중복된 요청', () => {
        it('POST /api/likes/{bookId} 요청 시 이미 처리된 요청임을 알림', (done) => {
            request(app)
                .post('/api/likes/1')
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

describe('좋아요 취소', () => {
    describe('정상 요청', () => {
        it('DELETE /api/likes/{bookId} 요청 시 좋아요 record 삭제', (done) => {
            request(app)
                .delete('/api/likes/1')
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
        it('DELETE /api/likes/{bookId} 요청 시 이미 처리된 요청임을 알림', (done) => {
            request(app)
                .delete('/api/likes/1')
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