## 🙌 뉴스피드 사전과제
 1. 과제관련 API 구현
- User API : 로그인, 회원가입
- 관리자 API : 학교 등록, 뉴스 등록, 뉴스 수정, 뉴스 삭제
- 학생 API : 모든학교 조회, 구독한 학교 조회, 학교 구독, 학교 구독 취소, 학생이 구독한 모든 뉴스 조회, 구독한 특정학교 뉴스 조회

2. AWS Cognito를 이용하여 회원가입 및 로그인 기능 구현
- Cognito를 통한 아이디별 정보 및 권한 확인

3. Serverless 구현
- node, Typescript, lambda, apigateway 연동 및 배포 구현
- 기본 구조도
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/c14b6e58-5ac5-4659-a504-285e3d7a116a"></p>

4. DynamoDB
- Aws DynamoDB를 사용하여 데이터 핸들링

5. 테스트 코드 작성
- 단위 테스트코드 작성

6. API Specification으로 Swagger 사용
- 스웨거 구현
- [스웨거 주소](https://74skmq1mmk.execute-api.ap-northeast-2.amazonaws.com/swagger)


## 🛠 사용 기술 스택
- serverless framework
- nodeJs
- TypeScript
- Aws lambda
- Aws cognito
- Aws Apigateway
- Aws DynamoDB
- Swagger
- jest
  
## ❓ 구현 내용 및 구동 방법
1. 스웨거 홈
- Schemes를 HTTPS로 변경해야 CORS 에러가 발생안함
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/83b95bb3-8de5-49ac-ac7a-41eed490fc6f"></p>

2. 회원 가입(유저)
- JsonBody : {
  "username": "string",
  "password": "string",
  "email": "string"
}
- password는 8자 이상
- username은 Unique값으로 중복 허용을 하지 않음
- 중복 회원, 비밀번호 길이에대한 검증, 유저등록 fail에 대한 예외 로직 구현
- 회원가입 완료 화면
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/6b48d8ad-3c98-4f6c-9e8d-b6a58717c98e"></p>

3. 로그인(유저)
- JsonBody : {
  "username": "string",
  "password": "string"
}
- 관리자 아이디는 만들어 논상태 {"username": :admin", "password": "admin1234"}
- 유저는 회원가입을 통해 진행해도 되고 미리 만들어둔 테스트 유저 {"username": :test", "password": "test1234"}
  <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/88f88397-2b7c-470d-9130-c3ab5b34577a"></p>
- 로그인해서 나온 response에서 reslut.idToken.jwtToken 을 복사해서 Swagger의 오른쪽위 상단의 Authorize에 넣어주면 로그인 상태가 되어서 다른 API가 사용이 가능함.
- admin계정과 기본계정에 따라 따로 로그인 후 토큰을 바꿔주어야 함.
  <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/dd243f61-0720-4c5c-a8c9-79477bef7689"></p>

4. 학교등록(관리자)
- JsonBody : {
  "name": "string",
  "region": "string"
}
- 학교 이름, 지역을 넣어 학교 등록이 가능
- 토큰 유무, 관리자 아이디 검증, request 필드 검증 예외 처리
  <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/836c1492-e2c7-43df-90a6-206e2f2e4560"></p>

5. 뉴스등록(관리자)
- JsonBody : {
  "schoolId": "string",
  "topic": "string",
  "content": "string"
  }
- 학교ID, 제목, 본문 을 넣어 뉴스 등록 가능
- 뉴스를 등록하면 해당 학교를 구독중인 학생들의 NewsFeed테이블에 컬럼 같이 생성
- 테이블을에 대한 데이터 수정이므로 트랜잭션 처리
  <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/f2b92faf-7c03-494e-aa48-6706c681c6df"></p>

6. 뉴스수정(관리자)
- JsonBody : {
  "newsId": "string",
  "topic": "string",
  "content": "string"
}
- 뉴스ID, 수정제목, 수정본문 넣어서 등록
- 뉴스 존재 안할시 예외처리
- 히스토리를 위해 업데이트 일시 업데이트
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/61b2750e-6340-457c-998b-b2687bb5bdcf"></p>
  
7. 뉴스삭제(관리자)
- JsonBody : {
  "newsId": "string",
}
- 뉴스ID로 삭제
- 뉴스 존재 안할시 예외처리
- 논리적 삭제 적용 및 히스토리를 위해 학제 일시 업데이트
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/f6ad2bdc-f8c3-4859-9de1-189e881b47aa"></p>

8. 모든 학교 조회(공통)
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/ab09ae69-9c23-4829-a6ed-3c078ded172d"></p>

9. 구독한 학교 조회(학생)
- 학생이 구독한 학교 리시트로 조회
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/93e63c6b-4b09-40c9-9ea1-03ebb1de38fd"></p>

10. 학교 구독(학생)
- JsonBody : - JsonBody : {
  "newsId": "string",
}
- 학교 ID를 이용하여 학교 구독
- 이미 구독한 학교 예외처리
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/4264094a-850a-47f0-8bfe-34b527efd7c0"></p>

11. 학교 구독 취소(학생)
- 구독과 같이 학교 ID를 이용하여 학교 구독 취소
- 취소할 구독이 없을 경우 예외처리
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/feedde65-6bdf-4fda-b7a2-eb1f4ee7e9f0"></p>

12. 학생의 모든 뉴스 조회(학생)
- 구독중인 모든 학교 뉴스를 최신순으로 노출
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/a261de81-40df-4958-9eb8-bc42459a955a"></p>

13. 학교를 선택하여 해당 학교 뉴스 조회(학생)
- PathParam에 학교ID를 넣어 해당 학교의 뉴스 조회
- 구독중인지 여부 판단 예외처리
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/58bc4bc5-06fb-4e4e-87b4-8b512ba7f8cd"></p>

14. 단위테스트
- 테스트 커버리지 내용
- 반복되는 인증 테스트는 스킵하여 커버리지가 낮아짐
    <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/5f681a66-424a-4121-9c98-961ae7815b1a"></p>


## 🙋‍♀️ Trouble Shooting
1. DynamoDB 파티션키, 정렬키에 대한 이해
- DynamoDB를 실적용은 처음이라 작업도중 Scan보다 Query가 더 빠르단것을 인지
- QueryInput으로 변경 작업도중 DB를 수정하니 이전 소스 Key값으로 GetItem에서 오류가 발생
- GetItem으로 서칭할떈 파티션키, 정렬키 둘다 필요함을 인지
- query : 파티션 키와 정렬 키로 값을 읽어오는 방식
- scan : 전체 데이터를 읽어오는 형식
- 새로 설계시엔 파티션키, 정렬키, 보조 인덱스를 어떻게 적용함에 따라서 DB 성능이 차이날수 있단걸 알았고 세심한 설계의 필요

2. QueryInput을 통해 데이터 서칭이 더빠름을 인지하고 적용중 문제
- In Operator가 될줄알았지만 KeyConditionExpression에서 적용되는 문법의 한계가 있음을 인지
- [KeyConditionExpression은 여러 항목에 대해 검색이 가능한 연산자](https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/LegacyConditionalParameters.KeyConditions.html)

3. severless framework의 실사용
- 람다와 api Gateway를 테스트는 해보았지만 서버리스 프레임워크 연동을 처음 진행이라 세팅의 더딤

4. TestCode
- 기존 사용하던 테스트 코드는 DB에 대한 MockData를 만들어서 테스트
- DynamoDB를 사용하면서 AwsMock을 처음 적용해봄
- 캐치를 해서 Mock데이터를 가져올줄 알았지만 실제 DB에 적용된는 것을 확인
- 통과된 테스트가 DB변화로인해 나중엔 실패
- 테스트용 DB연결 혹은 Mock 데이터에 직접적으로 연결하는 방식으로 TOBE

5. Swagger
- 될줄알았던 serverless-openapi-dacumentation이 더이상 적용이 안됨
- serverless-auto-swagger을 통해 스웨거 구성
- 스웨거 deploy시 cors발생
- host 주소를 변경, 응답헤더에 Cors Allow Origin을 넣어주어 해결
- 추후 해당 응답을 한번에 관리할수있도록 코드 리팩토링 필요성 인지


## 🚗 TOBE 보안했으면 하는 사항
1. 회원가입에 대한 Validation 추가
2. 관리자 전체 뉴스 조회
3. 전체 학교 조회시 내가 구독한 학교 판별값추가와 우선 정렬
4. 테스트코드가 awsMock을 사용했지만 실제 DB사용
 - mockData를 만들거나 테스트용 DB를 만들어서 테스트 방법 강구
5. gitAction, Terraform등을 이용한 CI/CD구성
6. DynamoDB 선능향상을 위한 인덱싱
7. 간단히 Congnito Token 유무와 데이터 유무로만 판단했지만 토큰 유효시간 정보를 통해 필터링
