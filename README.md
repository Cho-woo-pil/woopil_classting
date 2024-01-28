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
  
## ❓ 구현 내용   
1. 스웨거 홈
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/83b95bb3-8de5-49ac-ac7a-41eed490fc6f"></p>

2. 회원 가입
- Json Body : {
  "username": "string",
  "password": "string",
  "email": "string"
}
- password는 8자 이상
- username은 Unique값으로 중복 허용을 하지 않음

## 🛠 사용 기술
- serverless framework
- nodeJs
- TypeScript
- Aws lambda
- Aws cognito
- Aws Apigateway
- Aws DynamoDB
- Swagger
- jest

## 🙋‍♀️ Trouble Shooting
1. 
- GET /kstd/venue
- 강의실 고유ID, 강의실 이름 응답
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/f7d03ae3-dde2-4fa0-9976-5704abe91c0b"></p>
  
2. 강의실 등록 API
- POST /kstd/venue
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/376a5e70-f1f7-4cfe-ad29-657ae153fdf2"></p>
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/b38d2ba5-2043-42ba-9d9d-15c3bc00a47c"></p>  

3. 강연 등록 API
- POST /kstd/lecture/registor
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/7528ef89-e1dc-4c71-83ba-6ac86a099438"></p>
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/44516740-9327-4fa1-9266-d1f55d8e75f5"></p>  

4. 강연목록(신청 간능한 시점부터 시작 1일후 노출)
- GET /kstd/lecture/list/upcomming
- 강의ID, 강연자, 강연장, 강연내용, 강의시작시간, 강의시간, 총인원, 신청인원 응답
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/2524765c-edcd-46b9-9bef-ecd2bb59f9ca"></p>

5. 강연목록(전체)
- GET /kstd/lecture/list/all
- 강의ID, 강연자, 강연장, 강연내용, 강의시작시간, 강의시간, 총인원, 신청인원 응답
<p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/aac55c46-f913-44c7-8ab8-cbd7958ca1cb"></p>

6. 실시간 인기 강의
- GET /kstd/lecture/list/popular
- 4의 신청가능한 목록을 3일이내 신청기록이 가장 많은 순으로 정렬
- 강의ID, 강연자, 강연장, 강연내용, 강의시작시간, 강의시간, 총인원, 신청인원 응답
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/9372a9ec-0f6a-4da0-bd14-99ab6be7de1c"></p>

7. 강연 신청 목록 조회(특정강의)
- GET /kstd/lecture/applications/{lectureId}
- 강연 ID 파라미터로 Path에 입력
- 강연ID, 강연자, 강연장ID, 강연내용, 강의시작시간, 강의시간, 신청자목록 리스트 응답
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/354ed09b-ca88-435a-a48b-2b8f65c96766"></p>

8. 강연 신청 목록 조회(전체)
- GET /kstd/lecture/application/all
- (강연ID, 강연자, 강연장ID, 강연내용, 강의시작시간, 강의시간, 신청자목록 리스트) 의 리스트 응답
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/c6700f1e-7c2c-42ea-8bc3-a4f92f1d58c7"></p>

9. 강연 신청
- POST /kstd/lecture/apply
- 강연ID, 사원ID 입력
- 중복신청, 없는강의 신청, 신청하지 않은 강의, 가득찬 강의에 대한 예외처리
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/c769f767-fd6d-4037-ac97-1d6928b1bf87"></p>

10. 강연 취소
- PATCH /kstd/lecture/cancle
- 강연ID, 사원ID 입력
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/3e5a160b-8eb1-4771-adf6-2f749b49cdb7"></p>

11. 강연 신청내역 조회
- GET /kstd/lecture/apply/history/{employeeId}
- 강연ID, 신청일 응답
 <p align="center">
  <img src="https://github.com/Cho-woo-pil/kstd/assets/20333090/9e8ebcec-8ee4-4040-99d5-1f72c5d573f4"></p>


## 🚗 TOBE 보안했으면 하는 사항
1. 회원가입에 대한 Validation 추가
2. 관리자 전체 뉴스 조회
3. 전체 학교 조회시 내가 구독한 학교 판별값추가와 우선 정렬
4. 테스트코드가 awsMock을 사용했지만 실제 DB사용
 - mockData를 만들거나 테스트용 DB를 만들어서 테스트 방법 강구
5. gitAction, Terraform등을 이용한 CI/CD구성
6. DynamoDB 선능향상을 위한 인덱싱
