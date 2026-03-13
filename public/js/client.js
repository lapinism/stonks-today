document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

async function initPage() {
    const container = document.querySelector('main');
    if (!container) {
        console.error('The container for cards is not found.');
        return;
    }

    try {
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
            throw new Error(`Failed to fetch users: ${usersResponse.statusText}`);
        }
        const users = await usersResponse.json();

        users.forEach(user => {
            const card = createCardElement(user);
            container.appendChild(card);
            fetchStatusForUser(user.username);
        });

    } catch (error) {
        console.error('Error initializing page:', error);
        container.innerHTML = '<p>사용자 목록을 불러오는데 실패했습니다.</p>';
    }
}

function createCardElement(user) {
    const card = document.createElement('a');
    card.href = `/${user.username}`;
    card.className = 'status-card loading';
    card.id = `card-${user.username}`;

    card.innerHTML = `
        <h3>${user.name}</h3>
        <div class="yield-display">
            <span id="yield-val-${user.username}">---</span>%
        </div>
        <p id="message-${user.username}">데이터 불러오는 중...</p>
    `;
    return card;
}

async function fetchStatusForUser(username) {
    const yieldEl = document.getElementById(`yield-val-${username}`);
    const messageEl = document.getElementById(`message-${username}`);
    const cardEl = document.getElementById(`card-${username}`);

    try {
        const response = await fetch(`/api/${username}/status`);
        if (!response.ok) throw new Error('Server response was not ok.');
        const data = await response.json();

        data.yield *= 100;
        const prefix = data.yield > 0 ? '+' : '';
        yieldEl.textContent = `${prefix}${data.yield.toFixed(2)}`;
        messageEl.textContent = data.comment;

        cardEl.classList.remove('loading');
        cardEl.classList.add(`theme-${data.mood}`);
    } catch (error) {
        console.error(`Error fetching status for ${username}:`, error);
        if (messageEl) messageEl.textContent = "서버 연결 실패 ㅠㅠ";
        if (cardEl) cardEl.classList.remove('loading');
    }
}