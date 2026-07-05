module.exports = async (req, res) => {
    const keyword = req.query.keyword || '';
    if (!keyword) {
        res.status(400).send('Missing keyword');
        return;
    }

    try {
        const { execSync } = require('child_process');
        const apiResult = execSync(
            `curl -s --max-time 10 "https://met.api.xiaoguan.fit/api?server=netease&type=search&id=${encodeURIComponent(keyword)}"`,
            { timeout: 15000 }
        ).toString();
        const songs = JSON.parse(apiResult);

        // Generate the search results HTML page (server-side rendered)
        const { generateSearchPage } = require('../lib/generate-pages');
        const html = generateSearchPage(keyword, songs);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        const { generateSearchPage } = require('../lib/generate-pages');
        const html = generateSearchPage(keyword, []);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    }
};
