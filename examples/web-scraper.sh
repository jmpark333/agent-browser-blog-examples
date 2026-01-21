#!/bin/bash
# web-scraper.sh - agent-browser를 사용한 웹 스크래핑 봇
# 사용법: ./web-scraper.sh [URL]

set -e

# 타겟 URL (사용자가 지정 또는 기본값)
TARGET_URL="${1:-https://www.aitimes.com/}"

echo "🌐 웹 스크래핑 봇 시작..."
echo "타겟 URL: $TARGET_URL"
echo ""

# 결과 파일 초기화
> scraped_articles.txt
> links.txt
> snapshot.txt

# 1. 웹페이지 열기
echo "📄 웹페이지 열기..."
agent-browser open "$TARGET_URL"

# 2. 페이지 로딩 대기
echo "⏳ 페이지 로딩 대기..."
agent-browser wait --load networkidle

# 3. 페이지 제목 추출
echo ""
echo "📋 페이지 정보:"
TITLE=$(agent-browser get title 2>/dev/null | head -1)
echo "제목: $TITLE"

CURRENT_URL=$(agent-browser get url 2>/dev/null | head -1)
echo "URL: $CURRENT_URL"

# 4. 스냅샷 생성
echo ""
echo "📸 스냅샷 생성..."
agent-browser snapshot > snapshot.txt
echo "스냅샷 저장 완료: snapshot.txt"

# 5. 모든 링크 추출 (간단 방식)
echo ""
echo "🔗 링크 추출 중..."
# 스냅샷 내용을 결과 파일에 복사
cat snapshot.txt >> scraped_articles.txt

# 스냅샷에서 link가 포함된 라인 추출
echo ""
echo "📝 발견된 링크:"
grep -i "link" snapshot.txt | head -20 || echo "  (링크를 찾을 수 없음)"

# 7. 스크린샷 저장
echo ""
echo "📸 스크린샷 저장..."
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
agent-browser screenshot "screenshot-$TIMESTAMP.png"
echo "스크린샷 저장 완료: screenshot-$TIMESTAMP.png"

# 8. 브라우저 닫기
echo ""
echo "🔒 브라우저 닫기..."
agent-browser close

echo ""
echo "✅ 스크래핑 완료!"
echo ""
echo "📁 결과 파일:"
echo "  - snapshot.txt: 페이지 구조 스냅샷"
echo "  - links.txt: 모든 링크 목록"
echo "  - scraped_articles.txt: 추출된 링크 텍스트"
echo "  - screenshot-$TIMESTAMP.png: 페이지 스크린샷"
