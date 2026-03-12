document.addEventListener('DOMContentLoaded', () => {
    fetchStatus();
});

async function fetchStatus() {
    const yieldEl = document.getElementById('yield-val');
    const messageEl = document.getElementById('message');
    const cardEl = document.getElementById('status-card');
    const bodyEl = document.body;

    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        // 데이터 바인딩
        const prefix = data.totalYield > 0 ? '+' : '';
        yieldEl.textContent = `${prefix}${data.totalYield}`;
        messageEl.textContent = data.message;

        // 테마 적용 (Bull or Bear)
        cardEl.classList.remove('loading');
        bodyEl.className = `theme-${data.mood}`;
        
    } catch (error) {
        console.error('Error fetching stonks:', error);
        messageEl.textContent = "서버 연결 실패 ㅠㅠ";
    }
}