#!/usr/bin/env node
// test-ollama.js - 간단한 Ollama API 응답 테스트

const OLLAMA_API = 'http://localhost:11434/api/generate';

async function testOllama(model = 'minimax-m2.1:cloud') {
    console.log('🤖 Ollama API 테스트 시작...');
    console.log(`모델: ${model}`);
    console.log('');

    const testPrompt = '안녕! 간단하게 인사를 한 번 해줘.';

    console.log(`📝 프롬프트: "${testPrompt}"`);
    console.log('');

    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                prompt: testPrompt,
                stream: false
            })
        });

        console.log(`📡 HTTP 상태: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ 요청 실패: ${errorText}`);
            return false;
        }

        const data = await response.json();

        console.log('');
        console.log('✅ 응답 성공!');
        console.log('');
        console.log('🤖 AI 응답:');
        console.log('─'.repeat(50));
        console.log(data.response);
        console.log('─'.repeat(50));
        console.log('');

        // 응답 메타데이터
        if (data.created_at) {
            console.log(`⏱️  생성 시간: ${new Date(data.created_at * 1000).toLocaleString('ko-KR')}`);
        }
        if (data.eval_count) {
            console.log(`📊 평가 토큰 수: ${data.eval_count}`);
        }
        if (data.eval_duration) {
            const duration = (data.eval_duration / 1e9).toFixed(2);
            console.log(`⏱️  응답 시간: ${duration}초`);
        }

        console.log('');
        console.log('✅ 테스트 완료!');
        return true;

    } catch (error) {
        console.error(`❌ 오류 발생: ${error.message}`);
        console.error('');
        console.error('🔧 해결 방법:');
        console.error('1. Ollama가 실행 중인지 확인: ollama serve');
        console.error('2. API 주소 확인: http://localhost:11434');
        console.error('3. 모델이 설치되어 있는지 확인: ollama list');
        return false;
    }
}

// 실행
const model = process.argv[2] || 'minimax-m2.1:cloud';
testOllama(model);
