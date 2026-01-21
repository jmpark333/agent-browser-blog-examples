// ai-scraper-bot.js - AI와 통합한 스마트 웹 스크래핑 봇
// 사용법: node ai-scraper-bot.js https://example.com

const { spawn } = require('child_process');
const fs = require('fs').promises;

class AIScraperBot {
    constructor(ollamaModel = 'minimax-m2.1:cloud') {
        this.ollamaModel = ollamaModel;
    }

    // agent-browser 명령 실행
    async runAgentCommand(cmd, args = []) {
        return new Promise((resolve, reject) => {
            const process = spawn('agent-browser', [cmd, ...args], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let output = '';
            let errorOutput = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    // 에러가 있어도 출력 반환 (일부 명령은 stderr로 출력)
                    resolve(output || errorOutput);
                }
            });
        });
    }

    // 웹페이지 내용 추출
    async extractPageContent(url) {
        console.log(`🌐 페이지 열기: ${url}`);
        await this.runAgentCommand('open', [url]);

        console.log('⏳ 페이지 로딩 대기...');
        await this.runAgentCommand('wait', ['--load', 'networkidle']);

        // 제목 추출
        const title = await this.runAgentCommand('get', ['title']);
        console.log(`📄 제목: ${title.trim()}`);

        // 본문 내용 추출 (JavaScript로 직접)
        console.log('📝 본문 추출 중...');
        const content = await this.runAgentCommand('eval', [
            'document.body.innerText'
        ]);

        await this.runAgentCommand('close');

        return {
            title: title.trim(),
            content: content.trim()
        };
    }

    // Ollama로 텍스트 요약 (API 사용)
    async summarizeWithAI(text) {
        console.log(`  🤖 Ollama API 요청 중... (${this.ollamaModel})`);

        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.ollamaModel,
                prompt: text,
                stream: false
            })
        });

        if (!res.ok) {
            const fallback = text.substring(0, 200) + '...';
            console.log('  ⚠️ Ollama API 실패, 간단 요약 사용');
            return fallback;
        }

        const data = await res.json();
        return data.response.trim();
    }

    // AI 스크래핑 실행 (페이지 추출 + AI 요약)
    async scrapeWithAI(url) {
        const { title, content } = await this.extractPageContent(url);

        // 요약을 위한 프롬프트 (500자로 제한)
        const summaryPrompt = `다음 내용을 3문장으로 요약해주세요:\n\n${content.substring(0, 500)}`;
        const summary = await this.summarizeWithAI(summaryPrompt);

        return {
            url,
            title,
            content: content.substring(0, 500),
            summary,
            timestamp: new Date().toISOString()
        };
    }


    // 결과 저장
    async saveResults(result, filename) {
        const content = JSON.stringify(result, null, 2);
        await fs.writeFile(filename, content, 'utf8');
        console.log(`\n💾 결과 저장: ${filename}`);
    }
}

// 메인 실행 함수
async function main() {
    const url = process.argv[2] || 'https://example.com';
    const model = process.argv[3] || 'minimax-m2.1:cloud';

    const bot = new AIScraperBot(model);

    try {
        const result = await bot.scrapeWithAI(url);

        console.log('\n' + '='.repeat(50));
        console.log('📊 스크래핑 결과');
        console.log('='.repeat(50));
        console.log(`URL: ${result.url}`);
        console.log(`제목: ${result.title}`);
        console.log(`\n원문 내용 (미리보기):`);
        console.log(result.content);
        console.log(`\n🤖 AI 요약:`);
        console.log(result.summary);
        console.log(`\n시간: ${result.timestamp}`);

        await bot.saveResults(result, 'ai_scraped_articles.json');

        console.log('\n✅ 완료!');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// 실행
main();
