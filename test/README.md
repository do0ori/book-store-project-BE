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
      ✔ GET /books?limit&page 요청 시 도서 목록 반환
    limit 누락
      ✔ GET /books?page 요청 시 잘못된 요청임을 알림
    page 누락
      ✔ GET /books?limit 요청 시 잘못된 요청임을 알림
    없는 페이지
      ✔ GET /books?limit&page 요청 시 존재하지 않는 페이지임을 알림

도서 개별 조회
    정상 요청
      ✔ GET /books/{bookId} 요청 시 해당 도서 정보 반환
    없는 도서 요청
      ✔ GET /books/{bookId} 요청 시 존재하지 않는 도서임을 알림

장바구니 담기
    ✔ POST /cart 요청 시 장바구니 record 추가 (47ms)
    ✔ POST /cart 요청 시 같은 item도 따로 장바구니 record 추가 (93ms)

(선택한) 장바구니 목록 조회
    ✔ GET /cart 요청 시 장바구니 목록 반환

장바구니 삭제
    정상 요청
      ✔ DELETE /cart/{itemId} 요청 시 해당 아이템 record 삭제
    중복된 요청
      ✔ DELETE /cart/{itemId} 요청 시 이미 처리된 요청임을 알림

결제 주문하기
    ✔ POST /orders 요청 시 주문 transaction 실행

주문 목록(내역) 조회
    ✔ GET /orders 요청 시 장바구니 목록 반환

주문 상세 상품 조회
    ✔ GET /orders/{orderId} 요청 시 이미 처리된 요청임을 알림

카테고리 전체 조회
    ✔ GET /category 요청 시 카테고리 전체 목록 반환

좋아요 추가
    정상 요청
      ✔ POST /likes/{bookId} 요청 시 좋아요 record 추가
    중복된 요청
      ✔ POST /likes/{bookId} 요청 시 이미 처리된 요청임을 알림

좋아요 취소
    정상 요청
      ✔ DELETE /likes/{bookId} 요청 시 좋아요 record 삭제
      ✔ DELETE /likes/{bookId} 요청 시 이미 처리된 요청임을 알림

회원가입
    짧은 비밀번호
      ✔ POST /users/signup 요청 시 잘못된 요청임을 알림
    정상 요청
      ✔ POST /users/signup 요청 시 회원 정보 추가
    가입된 계정
      ✔ POST /users/signup 요청 시 이미 가입된 계정임을 알림

로그인
    ✔ POST /users/login 요청 시 JWT 반환

비밀번호 초기화(재설정) 요청
    정상 요청
      ✔ POST /users/reset-password 요청 시 email 반환
    가입된 적 없는 email
      ✔ POST /users/reset-password 요청 시 unauthorized 반환

비밀번호 초기화(재설정)
    짧은 비밀번호
      ✔ PUT /users/reset-password 요청 시 잘못된 요청임을 알림
    정상 요청
      ✔ PUT /users/reset-password 요청 시 email 반환


27 passing (374ms)
```