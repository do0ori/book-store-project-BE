const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const { StatusCodes } = require('http-status-codes');
const { faker } = require('@faker-js/faker');

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
        it('POST /users/signup 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .post('/users/signup')
                .send(fakeUserWrongPassword)
                .expect(StatusCodes.BAD_REQUEST)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, "Request input validation fails.");

                    return done();
                });
        });
    });

    describe('정상 요청', () => {
        it('POST /users/signup 요청 시 회원 정보 추가', (done) => {
            request(app)
                .post('/users/signup')
                .send(fakeUser)
                .expect(StatusCodes.CREATED, done);
        });
    });

    describe('가입된 계정', () => {
        it('POST /users/signup 요청 시 이미 가입된 계정임을 알림', (done) => {
            request(app)
                .post('/users/signup')
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
    it('POST /users/login 요청 시 JWT 반환', (done) => {
        request(app)
            .post('/users/login')
            .send(fakeUser)
            .expect(StatusCodes.OK)
            .end((err, res) => {
                if (err) return done(err);

                const setCookie = res.headers['set-cookie'][0];

                assert(setCookie.includes('token='));
                assert(setCookie.includes('HttpOnly'));

                return done();
            });
    });
});

describe('비밀번호 초기화(재설정) 요청', () => {
    describe('정상 요청', () => {
        it('POST /users/reset-password 요청 시 email 반환', (done) => {
            request(app)
                .post('/users/reset-password')
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
        it('POST /users/reset-password 요청 시 unauthorized 반환', (done) => {
            request(app)
                .post('/users/reset-password')
                .send(fakeUserWrongEmail)
                .expect(StatusCodes.UNAUTHORIZED, done);
        });
    });
});

describe('비밀번호 초기화(재설정)', () => {
    describe('짧은 비밀번호', () => {
        it('PUT /users/reset-password 요청 시 잘못된 요청임을 알림', (done) => {
            request(app)
                .put('/users/reset-password')
                .send(fakeUserWrongPassword)
                .expect(StatusCodes.BAD_REQUEST)
                .end((err, res) => {
                    if (err) return done(err);

                    assert.strictEqual(res.body.message, "Request input validation fails.");

                    return done();
                });
        });
    });

    describe('정상 요청', () => {
        it('PUT /users/reset-password 요청 시 email 반환', (done) => {
            request(app)
                .put('/users/reset-password')
                .send(fakeUser)
                .expect(StatusCodes.OK, done);
        });
    });
});