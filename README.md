# agent-browser 블로그 및 예제

이 레포지토리는 [agent-browser](https://github.com/vercel-labs/agent-browser)를 활용한 웹 스크래핑 봇 예제와 블로그 글을 포함하고 있습니다.

## 📁 구조

```
agent-browser/
├── agent-browser-ai-web-automation.html  # 티스토리 블로그 HTML
├── examples/                             # 예제 코드
│   ├── web-scraper.sh                    # Bash 스크래핑 스크립트
│   ├── scraper-bot.js                   # Node.js 스크래핑 봇
│   └── ai-scraper-bot.js                # AI 기반 스마트 스크래핑 봇
└── README.md                             # 이 파일
```

## 🚀 빠른 시작

### 1. agent-browser 설치

```bash
npm install -g agent-browser
agent-browser install
```

### 2. 예제 실행

#### Bash 스크립트

```bash
chmod +x examples/web-scraper.sh
./examples/web-scraper.sh https://example.com
```

#### Node.js 봇

```bash
node examples/scraper-bot.js https://example.com
```

#### AI 스크래핑 봇 (Ollama 필요)

```bash
# Ollama가 설치되어 있어야 합니다
node examples/ai-scraper-bot.js https://example.com
```

## 📖 블로그 포스트

`agent-browser-ai-web-automation.html` 파일은 티스토리에 바로 붙여넣을 수 있는 형식으로 작성되었습니다.

### 주요 내용

- agent-browser 소개 및 특징
- 설치 방법
- 기본 사용법
- 웹 스크래핑 봇 만들기 예제
- 기존 도구와 비교
- 고급 기능 (세션 관리, 인증 헤더, 스트리밍)

## 🔗 관련 링크

- [agent-browser GitHub](https://github.com/vercel-labs/agent-browser)
- [agent-browser npm](https://www.npmjs.com/package/agent-browser)
- [Playwright 문서](https://playwright.dev)

## 📄 라이선스

이 프로젝트의 예제 코드는 MIT 라이선스 하에 제공됩니다.
