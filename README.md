# 📖Book Store
## 🔄️ERD (Entity Relationship Diagram)

[🔗강의 dbdigram ERD 바로가기](https://dbdiagram.io/d/songa-Book-Shop-ERD-658e846789dea62799b88dc3)

[🔗내 dbdigram ERD 바로가기](https://dbdiagram.io/d/Book-Store-658d66ff89dea62799ace992)

- book.category_id와 category.id의 관계를 n:1로 수정
- book의 column들 중 예약어인 것들을 다른 이름으로 변경
    - format → form
    - description → detail
    - index → table_of_contents
- user에 name, salt, created_at 추가
- book의 liked column 삭제 → 도서 조회 시 query로 like table에서 계산해서 반환
- delivery Table을 만들어서 delivery 정보를 따로 저장

## 🔄️API Design
[🔗API 명세 바로가기](https://do0ori.notion.site/0787440aa79f4091902a0d4eadb5c009?v=1f96b9f02a704ea88a75567746da1499&pvs=4)

- 👤회원 API
    - 회원가입
    - 로그인
    - 비밀번호 초기화 요청
    - 비밀번호 초기화
- 📖도서 API
    - 도서 조회
    - 도서 목록 길이 조회
    - 개별 도서 조회
- 🏷️카테고리 API
    - 카테고리 전체 조회
- ❤️좋아요 API
    - 좋아요 추가
    - 좋아요 취소
- 🛒장바구니 API
    - 장바구니 담기
    - (선택한) 장바구니 목록 조회
- 🛍️주문 API
    - 결제(주문)하기
    - 주문 내역 조회
    - 주문 상세 상품 조회