// scraper-bot.js - agent-browser를 사용한 Node.js 웹 스크래핑 봇
// 사용법: node scraper-bot.js https://example.com

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class AgentBrowserBot {
    constructor() {
        this.results = [];
    }

    // 명령 실행 헬퍼 함수
    async runCommand(cmd, args = []) {
        return new Promise((resolve, reject) => {
            const process = spawn('agent-browser', [cmd, ...args], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(stdout);
                } else {
                    reject(new Error(`Command failed: ${stderr}`));
                }
            });
        });
    }

    // 웹페이지 열기
    async open(url) {
        console.log(`🌐 Opening: ${url}`);
        await this.runCommand('open', [url]);
        await this.runCommand('wait', ['--load', 'networkidle']);
    }

    // 스냅샷 생성
    async getSnapshot() {
        console.log('📸 Taking snapshot...');
        const snapshot = await this.runCommand('snapshot', ['--json']);
        try {
            return JSON.parse(snapshot);
        } catch {
            return { raw: snapshot };
        }
    }

    // 요소 클릭
    async click(ref) {
        console.log(`🖱️ Clicking: ${ref}`);
        await this.runCommand('click', [ref]);
    }

    // 텍스트 입력
    async fill(ref, text) {
        console.log(`⌨️ Filling ${ref} with: ${text}`);
        await this.runCommand('fill', [ref, text]);
    }

    // 텍스트 추출
    async getText(ref) {
        const text = await this.runCommand('get', ['text', ref]);
        return text.trim();
    }

    // 기사 스크래핑
    async scrapeArticles(url) {
        await this.open(url);

        // 페이지 정보 추출
        const title = await this.runCommand('get', ['title']);
        const currentUrl = await this.runCommand('get', ['url']);

        console.log(`📄 Title: ${title.trim()}`);
        console.log(`🔗 URL: ${currentUrl.trim()}`);

        // 스냅샷 가져오기
        const snapshot = await this.getSnapshot();

        // 스크린샷 저장
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `screenshot-${timestamp}.png`;
        await this.runCommand('screenshot', [screenshotPath]);
        console.log(`📸 Screenshot saved: ${screenshotPath}`);

        // 결과 저장
        this.results.push({
            url: currentUrl.trim(),
            title: title.trim(),
            timestamp: new Date().toISOString()
        });

        await this.close();
        return this.results;
    }

    // 브라우저 닫기
    async close() {
        console.log('🔒 Closing browser...');
        await this.runCommand('close');
    }

    // 결과 저장
    async saveResults(filename) {
        const content = JSON.stringify(this.results, null, 2);
        await fs.writeFile(filename, content, 'utf8');
        console.log(`💾 Results saved to: ${filename}`);
    }
}

// 메인 실행 함수
async function main() {
    const url = process.argv[2] || 'https://example.com';
    const bot = new AgentBrowserBot();

    try {
        console.log('🤖 Web Scraping Bot Started\n');

        const results = await bot.scrapeArticles(url);

        console.log('\n📊 Scraping Results:');
        console.log(JSON.stringify(results, null, 2));

        await bot.saveResults('scraped_articles.json');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// 실행
main();
