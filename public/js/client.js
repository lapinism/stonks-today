document.addEventListener('DOMContentLoaded', () => {
    fetchStatus();
});

async function fetchStatus() {
    const yieldEl = document.getElementById('yield-val');
    const messageEl = document.getElementById('message');
    const cardEl = document.getElementById('status-card');
    const bodyEl = document.body;

    try {
        const response = await fetch('/api/user2/status');
        const data = await response.json();

        // 데이터 바인딩
        data.yield *= 100;
        const prefix = data.yield > 0 ? '+' : '';
        data.yield = data.yield.toFixed(2);
        yieldEl.textContent = `${prefix}${data.yield}`;
        messageEl.textContent = data.comment;

        // 테마 적용 (Bull or Bear)
        cardEl.classList.remove('loading');
        bodyEl.className = `theme-${data.mood}`;
        
    } catch (error) {
        console.error('Error fetching stonks:', error);
        messageEl.textContent = "서버 연결 실패 ㅠㅠ";
    }
}