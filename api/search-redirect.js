module.exports = async (req, res) => {
    const keyword = req.query.keyword || '';
    if (keyword) {
        res.redirect(301, '/s/' + encodeURIComponent(keyword));
    } else {
        res.redirect(301, '/');
    }
};
