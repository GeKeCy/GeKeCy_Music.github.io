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

export async function onRequest(context) {
    try {
        const res = await fetch('https://music.163.com/api/search/hot?type=1111', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://music.163.com/',
                'Accept': 'application/json'
            }
        });
        const data = await res.json();
        if (data && data.result && data.result.hots) {
            const hots = data.result.hots.map((h, i) => ({
                rank: i + 1,
                keyword: h.first
            }));
            return new Response(JSON.stringify({ code: 200, data: hots }), {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        throw new Error('no data');
    } catch (e) {
        return new Response(JSON.stringify({ code: 200, data: FALLBACK }), {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
