import * as portfolioRepository from './portfolio.repository.js';
import * as chartService from '../chart/chart.service.js';

export const getPortfolioByUsername = (username) => {
    return portfolioRepository.findByUsername(username);
};

export const getPortfolioStatusByUsername = async (username) => {
    const ret = {};
    ret.yield = await chartService.calcTodayYield(username);
    if (ret.yield > 0) {
        const comment = [
            '오늘 저녁은 소고기인가요?',
            '한강 물 온도 체크 안 해도 되겠네요!',
            '익절은 항상 옳습니다.',
            '계좌에 빨간 꽃이 피었습니다.',
            '이대로 화성까지 가즈아!',
            '수익률이 복사되고 있어요!',
            '부모님께 효도할 시간입니다.',
            '오늘 하루가 참 아름답네요.'
        ];
        ret.mood = 'bull';
        ret.comment = comment[Math.floor(Math.random() * comment.length)];
    }
    else if (ret.yield < 0) {
        const comment = [
            '한강 물 따뜻한가요?',
            '파란색은 눈에 좋다고 하네요...',
            '괜찮아요, 주식은 원래 대응이니까요.',
            '강제 장기 투자자가 되신 걸 환영합니다.',
            '아직 안 팔았으면 손실 아닙니다.',
            '오늘 저녁은 라면인가요?',
            '상장폐지만 아니면 기회는 옵니다.',
            '물타기 할 현금은 남아있으시죠?',
            '주식 창을 끄고 산책이라도 다녀오세요.',
            '내일은 해가 뜨겠죠, 아마도.',
            '손절도 실력이라는데... 힘내세요.'
        ];
        ret.mood = 'bear';
        ret.comment = comment[Math.floor(Math.random() * comment.length)];
    }
    return ret;
};

export const createPortfolio = (username, ticker, quantity, price) => {
    return portfolioRepository.create(username, ticker, quantity, price);
};

export const updatePortfolio = (username, ticker, quantity, price) => {
    return portfolioRepository.update(username, ticker, quantity, price);
};

export const deletePortfolio = (username, ticker) => {
    return portfolioRepository.deleteByTicker(username, ticker);
};
