# 🧪Test
## 📦Dependencies
> API endpoint 및 기능를 위해 🤥[fakerjs](https://www.npmjs.com/package/@faker-js/faker), 🦸‍♂️[supertest](https://www.npmjs.com/package/supertest?activeTab=readme), ☕[mocha](https://www.npmjs.com/package/mocha?activeTab=readme) 사용
```bash
npm install --save-dev @faker-js/faker supertest mocha
```

## 🏃‍♂️Run test
- 다음 명령어를 실행하면 mocha가 test 폴더의 모든 테스트 파일을 찾아 실행
- [package.json > scripts](../package.json#5) 참고
```bash
npm test
```

## 📊Test result
```bash
  도서 조회
    정상 요청
      ✔ GET /api/books?categoryId&recent&limit&page 요청 시 도서 목록 반환
    limit 누락
      ✔ GET /api/books?categoryId&recent&page 요청 시 잘못된 요청임을 알림
    page 누락
      ✔ GET /api/books?categoryId&recent&limit 요청 시 잘못된 요청임을 알림
    없는 페이지
      ✔ GET /api/books?categoryId&recent&limit&page 요청 시 존재하지 않는 페이지임을 알림

  도서 개별 조회
    정상 요청
      ✔ GET /api/books/{bookId} 요청 시 해당 도서 정보 반환
    없는 도서 요청
      ✔ GET /api/books/{bookId} 요청 시 존재하지 않는 도서임을 알림

  장바구니 담기
    ✔ POST /api/cart 요청 시 장바구니 record 추가
    ✔ POST /api/cart 요청 시 같은 item도 따로 장바구니 record 추가

  (선택한) 장바구니 목록 조회
    ✔ GET /api/cart 요청 시 장바구니 목록 반환

  장바구니 삭제
    정상 요청
      ✔ DELETE /api/cart/{itemId} 요청 시 해당 아이템 record 삭제
    중복된 요청
      ✔ DELETE /api/cart/{itemId} 요청 시 이미 처리된 요청임을 알림

  결제 주문하기
    ✔ POST /api/orders 요청 시 주문 transaction 실행

  주문 목록(내역) 조회
    ✔ GET /api/orders 요청 시 장바구니 목록 반환

  주문 상세 상품 조회
    ✔ GET /api/orders/{orderId} 요청 시 이미 처리된 요청임을 알림

  카테고리 전체 조회
    ✔ GET /api/category 요청 시 카테고리 전체 목록 반환

  좋아요 추가
    정상 요청
      ✔ POST /api/likes/{bookId} 요청 시 좋아요 record 추가
    중복된 요청
      ✔ POST /api/likes/{bookId} 요청 시 이미 처리된 요청임을 알림

  좋아요 취소
    정상 요청
      ✔ DELETE /api/likes/{bookId} 요청 시 좋아요 record 삭제
    중복된 요청
      ✔ DELETE /api/likes/{bookId} 요청 시 이미 처리된 요청임을 알림

  토큰 재발급
    정상 요청
      ✔ GET /api/refresh 요청 시 accessToken 반환
    만료되지 않은 access token 사용
      ✔ GET /api/refresh 요청 시 만료되지 않았음을 알림

  회원가입
    짧은 비밀번호
      ✔ POST /api/users/signup 요청 시 잘못된 요청임을 알림
    정상 요청
      ✔ POST /api/users/signup 요청 시 회원 정보 추가
    가입된 계정
      ✔ POST /api/users/signup 요청 시 이미 가입된 계정임을 알림

  로그인
    ✔ POST /api/users/login 요청 시 access & refresh token 반환

  비밀번호 초기화(재설정) 요청
    정상 요청
      ✔ POST /api/users/reset-password 요청 시 email 반환
    가입된 적 없는 email
      ✔ POST /api/users/reset-password 요청 시 unauthorized 반환

  비밀번호 초기화(재설정)
    짧은 비밀번호
      ✔ PUT /api/users/reset-password 요청 시 잘못된 요청임을 알림
    정상 요청
      ✔ PUT /api/users/reset-password 요청 시 email 반환

  로그아웃
    정상 요청
      ✔ POST /api/users/logout 요청 시 refreshToken cookie 삭제
    중복된 요청
      ✔ POST /api/users/logout 요청 시 이미 refresh token이 삭제되었으므로 재로그인 안내


  31 passing (284ms)
```