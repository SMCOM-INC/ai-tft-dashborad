# 🔑apt-admin

아파트먼트 관리자 웹

## 🎈실행방법

개발 환경을 실행하기 위해 클론 받습니다.

```bash
git clone https://github.com/SMCOM-INC/apt-admin-fe.git
```

프로젝트 디렉토리로 이동합니다.

```bash
cd apt-admin-fe
```

v20 이상의 Node.js 환경에서 실행합니다.

```bash
nvm use
또는 nvm use 20
```

프로젝트가 의존하는 패키지들을 설치합니다.

```bash
npm install
```

담당자에게 환경변수에 대한 정보를 전달 받습니다.

```
root 디렉토리에 .env.development .env.production 파일 생성
환경변수 입력
```

실행 명령어 입니다.

```bash
npm run dev (개발 환경 - .env.development)
npm run prod (운영 환경 - .env.production)
```

## 🎈commit prefix

```
feat : 새로운 기능 추가
fix : 버그 및 기타 수정
refactor : 코드 리팩토링
rename : 네이밍 수정, 파일 이동, 오타 수정
remove : 파일 삭제
style : style 관련 변경
chore : 빌드 부분 혹은 패키지 매니저, config 수정, 모듈 추가
docs : 문서 작성
hotfix : 긴급 작업
test : 테스트 코드 관련
perf : 퍼포먼스 효율 개선 관련
```

## 🎈폴더구조

```
📦apt-admin-fe
┣ 📂public
┣ 📂src
┃ ┣ 📂apis
┃ ┣ 📂assets
┃ ┃ ┣ 📂icons
┃ ┣ 📂components
┃ ┃ ┣ 📂common
┃ ┃ ┣ 📂layout
┃ ┃ ┃ ┗📂components
┃ ┣ 📂constants
┃ ┣ 📂lib
┃ ┃ ┣ 📂composables
┃ ┃ ┣ 📂queries
┃ ┃ ┗ 📂utils
┃ ┣ 📂mocks
┃ ┣ 📂router
┃ ┣ 📂schemas
┃ ┣ 📂stores
┃ ┣ 📂views
┃ ┃ ┃ ┣ 📂AptView
┃ ┃ ┃ ┣ 📂BoardView
┃ ┃ ┃ ┣ 📂MemberView
┃ ┃ ┃ ... etc
┃ ┃ ┃ ┗ 📂ParkingView
┃ ┣ 📜App.vue
┃ ┣ 📜input.css
┃ ┗ 📜main.js
┗ 📜etc (setting files)
```
