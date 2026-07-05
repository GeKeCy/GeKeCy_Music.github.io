module.exports = async (req, res) => {
    try {
        const { execSync } = require('child_process');
        // 调用网易云热搜榜 API
        const raw = execSync(
            `curl -s --max-time 10 "https://music.163.com/api/search/hot?type=1111"`,
            { timeout: 15000 }
        ).toString();
        const data = JSON.parse(raw);

        if (data && data.result && data.result.hots) {
            const hots = data.result.hots.map((h, i) => ({
                rank: i + 1,
                keyword: h.first
            }));
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({ code: 200, data: hots });
        } else {
            // 备用：如果官方API失效，返回默认热门
            const fallback = [
                { rank: 1, keyword: '周杰伦' }, { rank: 2, keyword: '林俊杰' },
                { rank: 3, keyword: '薛之谦' }, { rank: 4, keyword: '邓紫棋' },
                { rank: 5, keyword: '陈奕迅' }, { rank: 6, keyword: '许嵩' },
                { rank: 7, keyword: '李荣浩' }, { rank: 8, keyword: '赵雷' },
                { rank: 9, keyword: 'Beyond' }, { rank: 10, keyword: '刘德华' }
            ];
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({ code: 200, data: fallback });
        }
    } catch (e) {
        const fallback = [
            { rank: 1, keyword: '周杰伦' }, { rank: 2, keyword: '林俊杰' },
            { rank: 3, keyword: '薛之谦' }, { rank: 4, keyword: '邓紫棋' },
            { rank: 5, keyword: '陈奕迅' }, { rank: 6, keyword: '许嵩' },
            { rank: 7, keyword: '李荣浩' }, { rank: 8, keyword: '赵雷' },
            { rank: 9, keyword: 'Beyond' }, { rank: 10, keyword: '刘德华' }
        ];
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ code: 200, data: fallback });
    }
};
