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
[🔗API 명세 바로가기](https://do0ori.notion.site/Sprint2-Book-Store-Project-API-0fd148429624424f90a60d9d7de3d003?pvs=4)

- 👤회원 API
- 📖도서 API
- 🏷️카테고리 API
- ❤️좋아요 API
- 🛒장바구니 API
- 🛍️주문 API