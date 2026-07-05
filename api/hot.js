const https = require('https');

function fetchHotSearch() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'music.163.com',
            path: '/api/search/hot?type=1111',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://music.163.com/',
                'Accept': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.result && json.result.hots) {
                        resolve(json.result.hots.map((h, i) => ({
                            rank: i + 1,
                            keyword: h.first
                        })));
                    } else {
                        reject(new Error('No hots data'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')); });
        req.end();
    });
}

const FALLBACK = [
    { rank: 1, keyword: '加木' }, { rank: 2, keyword: '海屿你' },
    { rank: 3, keyword: '时差' }, { rank: 4, keyword: '阴天' },
    { rank: 5, keyword: '无人之岛' }, { rank: 6, keyword: '玻璃' },
    { rank: 7, keyword: '失眠' }, { rank: 8, keyword: 'Angel' },
    { rank: 9, keyword: '空山·野马' }, { rank: 10, keyword: '讨厌' },
    { rank: 11, keyword: '周杰伦' }, { rank: 12, keyword: '林俊杰' },
    { rank: 13, keyword: '薛之谦' }, { rank: 14, keyword: '邓紫棋' },
    { rank: 15, keyword: '陈奕迅' }
];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
        const hots = await fetchHotSearch();
        res.json({ code: 200, data: hots });
    } catch (e) {
        // 备用数据，保证永远能返回
        res.json({ code: 200, data: FALLBACK });
    }
};
