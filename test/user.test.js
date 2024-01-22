const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');
const { faker } = require('@faker-js/faker');
let accessToken;
let refreshToken;

const sex = faker.person.sexType();
const firstName = faker.person.firstName(sex);
const lastName = faker.person.lastName();
const email = faker.internet.email({ firstName, lastName });
const wrongEmail = faker.internet.email({ lastName: firstName, firstName: lastName });
const password = faker.internet.password({ length: 10 });
const wrongPassword = faker.internet.password({ length: 5 });
fakeUser = { email, password };
fakeUserWrongEmail = { email: wrongEmail, password };
fakeUserWrongPassword = { email, password: wrongPassword };


describe('회원가입', () => {
    describe('짧은 비밀번호', () => {
        it('POST /api/users/signup 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .post('/api/users/signup')
                .send(fakeUserWrongPassword)
                .expect(StatusCodes.BAD_REQUEST, done);
        });
    });

    describe('정상 요청', () => {
        it('POST /api/users/signup 요청 시 회원 정보 추가', (done) => {
            request(app)
                .post('/api/users/signup')
                .send(fakeUser)
                .expect(StatusCodes.CREATED, done);
        });
    });

    describe('가입된 계정', () => {
        it('POST /api/users/signup 요청 시 이미 가입된 계정임을 알림', (done) => {
            request(app)
                .post('/api/users/signup')
                .send(fakeUser)
                .expect(StatusCodes.CONFLICT)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, `${email}은 이미 가입된 계정입니다.`);

                    return done();
                });
        });
    });
});

describe('로그인', () => {
    it('POST /api/users/login 요청 시 access & refresh token 반환', (done) => {
        request(app)
            .post('/api/users/login')
            .send(fakeUser)
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                const setCookie = res.headers['set-cookie'][0];

                assert(setCookie.includes('refreshToken='));
                assert(setCookie.includes('HttpOnly'));
                assert(res.body.hasOwnProperty('accessToken'));

                accessToken = res.body.accessToken;
                refreshToken = setCookie.split(';')[0];

                return done();
            });
    });
});

describe('비밀번호 초기화(재설정) 요청', () => {
    describe('정상 요청', () => {
        it('POST /api/users/reset-password 요청 시 email 반환', (done) => {
            request(app)
                .post('/api/users/reset-password')
                .send(fakeUser)
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.email, email);

                    return done();
                });
        });
    });

    describe('가입된 적 없는 email', () => {
        it('POST /api/users/reset-password 요청 시 unauthorized 반환', (done) => {
            request(app)
                .post('/api/users/reset-password')
                .send(fakeUserWrongEmail)
                .expect(StatusCodes.UNAUTHORIZED, done);
        });
    });
});

describe('비밀번호 초기화(재설정)', () => {
    describe('짧은 비밀번호', () => {
        it('PUT /api/users/reset-password 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .put('/api/users/reset-password')
                .send(fakeUserWrongPassword)
                .expect(StatusCodes.BAD_REQUEST, done);
        });
    });

    describe('정상 요청', () => {
        it('PUT /api/users/reset-password 요청 시 email 반환', (done) => {
            request(app)
                .put('/api/users/reset-password')
                .send(fakeUser)
                .expect(StatusCodes.OK, done);
        });
    });
});

describe('로그아웃', () => {
    describe('정상 요청', () => {
        it('POST /api/users/logout 요청 시 refreshToken cookie 삭제', (done) => {
            request(app)
                .post('/api/users/logout')
                .set("Authorization", `Bearer ${accessToken}`)
                .set("Cookie", refreshToken)
                .expect(StatusCodes.OK)
                .end((err, res) => {
                    if (err) return done(err);
    
                    const setCookie = res.headers['set-cookie'][0];
    
                    assert(setCookie.includes('refreshToken=;'));
    
                    return done();
                });
        });
    });

    describe('중복된 요청', () => {
        it('POST /api/users/logout 요청 시 이미 refresh token이 삭제되었으므로 재로그인 안내', (done) => {
            request(app)
                .post('/api/users/logout')
                .set("Authorization", `Bearer ${accessToken}`)
                .set("Cookie", refreshToken)
                .expect(StatusCodes.UNAUTHORIZED)
                .end((err, res) => {
                    if (err) return done(err);
    
                    assert.strictEqual(res.body.message, "세션이 만료되었습니다. 다시 로그인해주세요.");
    
                    return done();
                });
        });
    });
});