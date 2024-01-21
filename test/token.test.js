const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const accessToken = process.env.TEST_TOKEN;
const expiredToken = process.env.EXPIRED_TOKEN;
const infiniteRefreshToken = process.env.INFINITE_REFRESH_TOKEN;

describe('토큰 재발급', () => {
    describe('정상 요청', () => {
        it('GET /api/refresh 요청 시 accessToken 반환', (done) => {
            request(app)
                .get('/api/refresh')
                .set("Authorization", `Bearer ${expiredToken}`)
                .set("Cookie", `refreshToken=${infiniteRefreshToken}`)
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);
    
                    res.body.hasOwnProperty('accessToken');
    
                    return done();
                });
        });
    });

    describe('만료되지 않은 access token 사용', () => {
        it('GET /api/refresh 요청 시 만료되지 않았음을 알림', (done) => {
            request(app)
                .get('/api/refresh')
                .set("Authorization", `Bearer ${accessToken}`)
                .set("Cookie", `refreshToken=${infiniteRefreshToken}`)
                .expect(StatusCodes.BAD_REQUEST)
                .end((err, res) => {
                    if (err) return done(err);
    
                    assert.strictEqual(res.body.message, 'Access token is not expired.');
    
                    return done();
                });
        });
    });
});