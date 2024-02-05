# 환경변수
- DATABASE_URL
- DATABASE_HOST
- DATABASE_PORT
- DATABASE_NAME
- DATABASE_USERNAME
- DATABASE_PASSWORD
- SESSION_SECRET_KEY

# API 명세서 URL
https://www.notion.so/214ba977633a4fb88a5f1ab1e31d1b95?pvs=4

# ERD URL
https://www.erdcloud.com/d/k2SbAkeRER8GcXhmM

# 더 고민해 보기
1. **암호화 방식**
    - 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
      - 단방향 암호화에 해당한다고 생각합니다
    - 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
      - 암호화가 되어 정보가 세어나가지 않을 수 있습니다.

2. **인증 방식**
    - JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
    - 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

3. **인증과 인가**
    - 인증과 인가가 무엇인지 각각 설명해 주세요.
      - 인증: 서비스를 이용하려는 사용자가 인증된 신분을 가진 사람이 맞는지 검증하는 것
      - 인가: 이미 인증된 사용자가 특정 리소스에 접근하거나 특정 작업을 수행할 수 있는 권한이 있는지를 검증
    - 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
      - 사용자가 맞는지 확인하는 것이기 때문에 인증에 해당한다고 생각합니다.

4. **Http Status Code**
    - 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
      - 200 : 성공적으로 처리 | 로그인과 조회, 수정, 삭제 기능이 성공적으로 처리되었을 때 사용하였습니다.
      - 201 : 새로운 리소스 생성 | 회원가입, 이력서 생성 기능이 성공적으로 처리되었을 때 사용하였습니다.
      - 400 : 요청 구문이 잘못됨 | 비밀번호가 6자리 이하일 경우, 이력서 작성 시 제목, 자기소개가 누락 되었을 경우에 사용하였습니다.
      - 401 : 엑세시 권한이 없음 | 비밀번호가 일치하지 않을 경우, 수정 권한이 없을 경우에 사용하였습니다.
      - 404 : 찾을 수 없음 | 로그인 시 해당 이메일이 없을 경우, 해당 이력서가 존재하지 않을 경우에 사용하였습니다.
      - 409 : 요청 중 충돌 | 회원가입 시 해당 이메일이 존재할 경우에 사용하였습니다.

5. **리팩토링**
    - MySQL, Prisma로 개발했는데 MySQL을 MongoDB로 혹은 Prisma 를 TypeORM 로 변경하게 된다면 많은 코드 변경이 필요할까요? 주로 어떤 코드에서 변경이 필요한가요?
      - 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.
        - mysql에서 변경하게 된다면 prisma 부분의 코드를 변경해야 할 것 같습니다

6. **API 명세서**
    - notion 혹은 엑셀에 작성하여 전달하는 것 보다 swagger 를 통해 전달하면 장점은 무엇일까요?

