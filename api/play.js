module.exports = async (req, res) => {
    const songId = req.query.id || '';
    if (!songId) {
        res.status(400).send('Missing song id');
        return;
    }

    try {
        const { execSync } = require('child_process');
        const apiResult = execSync(
            `curl -s --max-time 10 "https://api.paugram.com/netease/?id=${songId}"`,
            { timeout: 15000 }
        ).toString();
        const data = JSON.parse(apiResult);

        const { generatePlayPage } = require('../lib/generate-pages');
        const html = generatePlayPage(data);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (e) {
        const { generatePlayPage } = require('../lib/generate-pages');
        const html = generatePlayPage(null, songId);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    }
};
