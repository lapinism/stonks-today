# 📈 Stonks Today (오늘의 임스피)

<p align="center">
   <img src="https://github.com/user-attachments/assets/d9d5044d-2344-4f24-99bc-b30dc5b03eff" width="50%" alt="오늘의 임스피"/>
</p>

> **"친구에게 물어볼 필요 없이, 오늘의 수익률을 웹에서 바로 확인하세요!"**  
> 카톡을 보내기 전, 오늘의 수익률로 친구의 기분을 먼저 확인해보세요! 😊

이 프로젝트는 **Express.js와 SQLite**를 사용하여 구현된 개인 포트폴리오 관리 및 수익률 시각화 웹 애플리케이션입니다. 국내 및 해외 주식의 실시간 시세를 API를 통해 연동하여 매일 변동하는 자산의 가치와 수익률을 계산하고 시각화합니다.

---

## 📸 미리보기 (Screenshots)

### 1. 메인 화면 (오늘의 기분 상태 목록)
오늘 수익률이 플러스(🔴)인지 마이너스(🔵)인지에 따라 테마 색상(상승: Bull, 하락: Bear)이 변경되며, 현재 상황을 유쾌하게 표현한 한마디가 카드 형식으로 제공됩니다.

![메인 화면](https://github.com/user-attachments/assets/25ca3ef7-261e-4e19-8c32-b06aacba92cf)

### 2. 상세 화면 (수익률 추이 그래프)
특정 사용자를 클릭하면 최근 1개월 혹은 1년 동안의 일별 누적 수익률 추이를 꺾은선 그래프로 조회할 수 있습니다.

![상세 화면](https://github.com/user-attachments/assets/955348ad-da00-4573-99b5-781e370d18c8)

---

## ✨ 주요 기능 (Key Features)

1. **포트폴리오 기반 오늘의 수익률 계산**
   - 사용자가 등록한 보유 주식(종목 Ticker, 수량, 매수가) 데이터를 기반으로 오늘의 실시간 주가 데이터를 반영하여 오늘의 수익률을 산출합니다.
2. **오늘의 기분 지표 (Mood Indicator)**
   - **상승장(Bull - Red)**: 붉은색 테마 적용 (기분 좋음 🥩)
   - **하락장(Bear - Blue)**: 푸른색 테마 적용 (주의 요망 🌊)
3. **기간별 누적 수익률 그래프**
   - Chart.js를 이용해 1개월(30일) / 1년 간의 누적 수익률 변화 추이를 꺾은선 그래프로 시각화합니다.
4. **포트폴리오 관리 UI**
   - 세션 로그인 인증을 통해 자신의 포트폴리오(종목 추가, 수량 및 매수가 수정, 삭제)를 관리할 수 있습니다.
5. **성능 최적화 및 외부 API 캐싱**
   - 잦은 외부 주가 조회 요청으로 인한 트래픽을 최소화하기 위해 당일 주가 데이터는 **인메모리 캐시**를 활용하고, 과거 시점의 자산 가치는 **SQLite 데이터베이스(`history` 테이블)**에 캐싱하여 성능을 최적화했습니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Backend**: Node.js (ES Modules)
- **Framework**: Express.js, `express-session`
- **Database**: SQLite (via `better-sqlite3`)
- **Frontend**: HTML5, CSS3 (Vanilla CSS), Vanilla JavaScript, **Chart.js** (CDN)
- **Data Source**: Yahoo Finance API (미국 주식 및 환율 연동), 네이버 금융 API (국내 주식 연동)

---

## 📂 디렉터리 구조 (Directory Structure)

```text
stonks_today/
├── db/                     # SQLite 데이터베이스 파일 및 마이그레이션 스크립트
│   ├── sqlite.db           # 데이터베이스 파일
│   └── seed.js             # 초기 스키마 및 더미 데이터 삽입 스크립트
├── public/                 # 프론트엔드 정적 파일
│   ├── css/
│   │   └── style.css       # 스타일시트
│   └── js/
│       └── client.js       # 메인 화면 DOM 조작 및 API 호출 스크립트
├── src/                    # 백엔드 소스 코드
│   ├── app.js              # Express 앱 인스턴스 설정 및 미들웨어/라우팅 연동
│   ├── server.js           # Express 서버 시작 진입점
│   ├── config/
│   │   └── db.js           # SQLite db 커넥션 설정
│   └── modules/            # 도메인 기반 모듈화 구조
│       ├── admin/          # 어드민 전용 라우터 및 로직
│       ├── auth/           # 세션 로그인 및 인가 미들웨어 서비스
│       ├── chart/          # 주가 데이터 수집, 가공 및 수익률 연산 엔진
│       ├── history/        # 일별 자산 가치 기록 레포지토리
│       ├── page/           # 웹 페이지(HTML) 서빙 라우터
│       ├── portfolio/      # 보유 종목 추가/수정/삭제 레포지토리 및 서비스
│       └── user/           # 사용자 정보 조회 레포지토리
├── views/                  # 화면 마크업 파일 (.html 템플릿)
│   ├── admin.html
│   ├── detail.html
│   ├── edit.html
│   ├── index.html
│   └── login.html
├── .env                    # 환경 변수 정의 파일
└── package.json            # 의존성 및 실행 스크립트 정의
```

---

## 🚀 시작 방법 (Quick Start)

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (`.env`)
프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 아래 설정 예시를 참고하여 작성합니다.
```env
PORT=3000

SECRET=your_session_secret_key
ADMIN_PASSWORD=your_admin_password

US_STOCK_API_URL="Yahoo Finance API URL"
USD_TO_KRW_API_URL="환율 API"
KR_STOCK_API_URL="네이버 금융 API"
```

### 3. 데이터베이스 초기화 및 더미 데이터 삽입
```bash
npm run db:seed
```

### 4. 개발 서버 실행
```bash
npm run dev
```
서버 실행 후 브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.
* **테스트 계정 정보**:
  * 아이디: `lim` / 비밀번호: `1234`
  * 아이디: `yoon` / 비밀번호: `1234`

---

## 💾 데이터 모델 (Data Models)

### `user` (사용자)
서비스를 이용하고 개별 포트폴리오를 관리하는 유저 정보 테이블입니다.
| 필드명 | 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `username` | TEXT | PRIMARY KEY | 로그인 시 사용하는 고유 ID |
| `name` | TEXT | NOT NULL | 화면에 표시될 사용자 이름 (예: `임스피`) |
| `password` | TEXT | NOT NULL | 비밀번호 (평문 저장) |

### `portfolio` (보유 종목)
각 사용자의 포트폴리오에 구성된 개별 주식 항목 테이블입니다.
| 필드명 | 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | 고유 식별값 |
| `username` | TEXT | FOREIGN KEY (user) | 소유 유저 ID |
| `ticker` | TEXT | NOT NULL | 주식 종목 코드 (예: 한국 `005930`, 미국 `STNE`) |
| `quantity` | REAL | NOT NULL | 보유 수량 |
| `price` | REAL | NOT NULL | 매수 평균 단가 (KRW 기준) |

### `history` (수익률 기록 캐싱)
기간별 차트 렌더링 속도 향상을 위해 과거 일자별로 계산된 자산 가치를 보관하는 테이블입니다.
| 필드명 | 타입 | 제약 조건 | 설명 |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | 고유 식별값 |
| `username` | TEXT | FOREIGN KEY (user) | 소유 유저 ID |
| `date` | TEXT | NOT NULL | 해당 영업일 날짜 (YYYY-MM-DD) |
| `principal` | REAL | NOT NULL | 해당 일자 기준의 매수 원금 합계 |
| `valuation` | REAL | NOT NULL | 해당 일자 종가 기준의 평가 자산 합계 |

---

## 💡 개발 시 참고 사항 (Developer Notes)

이 프로젝트의 핵심인 `src/modules/chart/chart.service.js`는 외부 주식 시세 API를 실시간 연동하고 데이터를 정제하여 계산합니다. 개발 시 아래 연동 구조와 데이터 처리 방식에 유의하십시오.

### 1. 외부 주가 및 환율 API 연동 구조

* **국내 주식 (Numeric Ticker)**
  * Ticker가 숫자로만 구성된 경우(예: 삼성전자 `005930`) 국내 주식으로 판단합니다.
  * **요청 API**: 네이버 금융 Fchart API (`KR_STOCK_API_URL`)
  * **특이사항**: API의 응답 데이터가 표준 JSON 형식이 아닌 싱글 쿼트(`'`)로 둘러싸인 텍스트 형식이므로, 파싱 전에 더블 쿼트(`"`)로 일괄 치환한 후 `JSON.parse()`를 수행합니다.
  * **데이터 매핑**: 응답 배열에서 `[날짜(YYYYMMDD), 시가, 고가, 저가, 종가, 거래량]` 중 0번째(날짜)와 4번째(종가) 데이터를 추출하여 파싱합니다.
* **해외 주식 (Alphabetic Ticker)**
  * Ticker가 영문자로 구성된 경우(예: `STNE`) 해외 주식으로 판단합니다.
  * **요청 API**: Yahoo Finance API (`US_STOCK_API_URL`)
  * **특이사항**: 미국 주식 가격은 달러(USD) 기준이므로 원화 가치 환산을 위해 환율 API(`USD_TO_KRW_API_URL`)의 환율 정보(`USD2KRW`)를 조회하여 종가에 곱해줍니다.
  * **데이터 매핑**: `json.chart.result[0].timestamp` 배열과 `json.chart.result[0].indicators.quote[0].close` 배열을 매핑하여 일별 원화 종가 데이터를 구성합니다.

### 2. 주말 및 공휴일(휴장일) 데이터 보간 (Data Interpolation)
* 주식 시장이 열리지 않는 주말 및 공휴일에는 API가 주가 데이터를 반환하지 않습니다.
* 차트 및 수익률 일별 추이를 끊김 없이 계산하기 위해, 특정 날짜의 주가 데이터가 누락된 경우 **이전 가장 가까운 영업일의 종가 데이터**를 복사하여 빈 날짜를 채워주는 보간 알고리즘이 적용되어 있습니다.

### 3. API 요청 최적화 및 캐싱 전략
* 불필요한 네트워크 오버헤드를 막기 위해 2중 캐싱 레이어가 구현되어 있습니다.
  * **인메모리 캐시**: `chart.service.js` 내부의 `Map` 객체를 사용하여 개별 종목의 주가 데이터를 **1분간 캐싱**합니다. 날짜가 변경될 경우 캐시는 자동으로 초기화됩니다.
  * **데이터베이스 캐싱**: 과거 날짜의 최종 자산 가치 평가액 및 원금 정보는 `history` 테이블에 기록하여, 매번 전수 계산을 수행하지 않고 DB 조회만으로 일별 누적 수익률을 빠르게 렌더링할 수 있도록 설계되었습니다.
