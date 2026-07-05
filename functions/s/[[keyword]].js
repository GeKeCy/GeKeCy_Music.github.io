function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateSearchPage(keyword, songs) {
  let rowsHtml = '';
  let count = 0;

  if (Array.isArray(songs) && songs.length > 0) {
    count = songs.length;
    songs.forEach((song, i) => {
      const urlMatch = song.url && song.url.match(/id=(\d+)/);
      const songId = urlMatch ? urlMatch[1] : '';
      const title = (song.title || '').replace(/"/g, '&quot;');
      const artist = (song.author || '').replace(/"/g, '&quot;');
      if (songId) {
        rowsHtml += `<tr>
                    <td style="font-size: 17px;color: grey;font-weight: 700;width: 56px;text-align: center;">${i + 1}</td>
                    <td><a href="/play/${songId}" class="text-info font-weight-bold">${title}</a></td>
                    <td style="color: #666;font-size: 15px;">${artist}</td>
                </tr>`;
      }
    });
  } else {
    rowsHtml = '<tr><td colspan="3" style="text-align:center;color:#999;padding:20px;">搜索失败，请稍后再试</td></tr>';
    count = 0;
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>搜索 ${escapeHtml(keyword)} - GeKeCy-music</title>
    <link href="/static/css/common.css" rel="stylesheet">
    <link href="//lib.baomitu.com/twitter-bootstrap/4.6.1/css/bootstrap.min.css" type="text/css" rel="stylesheet">
    <link href="//lib.baomitu.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" rel="stylesheet">
    <script src="//lib.baomitu.com/jquery/3.6.0/jquery.min.js" type="application/javascript"></script>
    <script defer src="//lib.baomitu.com/twitter-bootstrap/4.6.1/js/bootstrap.min.js" type="application/javascript"></script>
    <style>
        html, body { height: 100%; margin: 0; }
        body { display: flex; flex-direction: column; min-height: 100vh; font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, STHeiTi, sans-serif; }
        .main-content { flex: 1 0 auto; }
        .badge { margin-right: 3px; display: inline-block; padding: .25em .6em; font-size: 75%; font-weight: 700; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.7rem; }
        .card { margin-top: 15px; position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0, 0, 0, .125); border-radius: .5rem; font-size: 15px; }
        .btn-custom { background-color: #31c27c; border-color: #31c27c; color: white; border-radius: 0 0.25rem 0.25rem 0 !important; height: 40px; }
        .btn-custom:hover { background-color: #2ab06d; border-color: #2ab06d; }
        a { color: #333; text-decoration: none; background-color: transparent; }
        a:hover { color: #31c27c; text-decoration: underline; }
        .form-control:focus { background-color: #fff; border-color: #31c27c; outline: 0; box-shadow: 0 0 0 .2rem #31c27c38; }
        .form-control { border: 1px solid #31c27c; }
        .navbar-h1 { display: inline; font-size: 1.5rem; font-weight: 700; }
        .quote-warning { border-left: 4px solid #31c27c; background-color: #f8f9fa; padding: .5rem; color: #434343; }
        .table { width: 100%; margin-bottom: 0rem; color: #212529; }
        .table td, .table th { font-size: 15px; color: #999; padding: 1.15rem; vertical-align: middle; border-top: 0px solid #dee2e6; }
        .table-striped tbody tr:nth-child(odd) { background-color: #ffffff; }
        .table-striped tbody tr:nth-child(even) { background-color: #fafafa; }
        .table-striped tbody tr:hover { background-color: #f5f5f5; }
        .table thead th { vertical-align: bottom; border-bottom: 0px solid #dee2e6; }
        .text-info { color: #333 !important; }
        .font-weight-bold { font-weight: 545 !important; font-size: 15px; line-height: 1; }
        footer {
            flex-shrink: 0; background-color: #343a40; color: #999;
            padding: 40px 0 20px 0; margin-top: auto;
        }
        footer a { color: #ccc; }
        footer a:hover { color: #31c27c; }
        .footer-links { margin: 10px 0; }
        .footer-links a { margin: 0 10px; font-size: 13px; }
    </style>
</head>
<body>
<div class="main-content">
<div class="container" style="max-width: 900px">
    <nav class="navbar navbar-light bg-white px-0 mb-1 font-weight-normal">
        <a class="navbar-brand font-weight-bolder" style="font-size: 1.5rem; color: #50514F;" href="/">
            <h1 class="navbar-h1">GeKeCy-music</h1>
        </a>
    </nav>

    <form method="GET" action="/s/" style="margin-top: 1rem !important;margin-bottom: .5rem !important;">
        <div class="input-group">
            <input type="text" name="keyword" class="form-control text-center border border-info" placeholder="请输入歌名/歌手名" value="${escapeHtml(keyword)}" style="border-right-color: #31c27c !important;border-radius: 0.25rem 0 0 0.25rem !important;height: 40px;">
            <button type="submit" class="btn btn-custom shadow-sm rounded-sm btn-block mb-1" style="width: 60px;padding: 0px;">
                <i class="fa fa-search"></i>
            </button>
        </div>
    </form>

    <div class="card shadow-sm">
        <div class="card-body">
            <div class="quote-warning mb-4" style="text-align: left;font-size: 14px">
                共找到 <strong>${count}</strong> 条与 <small class="badge badge-pill badge-warning" style="background-color: #31c27c;font-size: 14px;color: #ffffff;">${escapeHtml(keyword)}</small> 相关的内容：
            </div>
            <table class="table table-striped table-hover">
                <thead>
                    <tr style="background: #fafafa;">
                        <th scope="col" style="width: 10%;text-align: center;">序号</th>
                        <th scope="col" style="width: auto">
                            <i class="fa fa-music"></i>
                            <span>歌曲</span>
                        </th>
                        <th scope="col" style="width: auto;text-align: left;">
                            <i class="fa fa-user-circle"></i>
                            <span>歌手</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    </div>
</div>
</div>

<footer>
    <div class="container" style="max-width: 900px;">
        <div class="text-center">
            <a href="/" class="font-weight-bold" style="font-size:18px;color:#fff;">GeKeCy-music</a>
            <div class="footer-links">
                <a href="/">首页</a>
                <a href="https://github.com/GeKeCy/GeKeCy_Music.github.io" target="_blank">GitHub</a>
            </div>
            <div style="font-size:12px;color:#666;margin-top:10px;">
                GeKeCy-music &copy; 2026 &middot; 仅供学习交流使用
            </div>
        </div>
    </div>
</footer>
</body>
</html>`;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  let keyword = context.params.keyword || url.searchParams.get('keyword') || '';
  keyword = decodeURIComponent(keyword);

  if (!keyword) {
    return Response.redirect(url.origin + '/', 302);
  }

  let songs = [];
  try {
    const res = await fetch(
      `https://met.api.xiaoguan.fit/api?server=netease&type=search&id=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    songs = await res.json();
  } catch (e) {
    songs = [];
  }

  const html = generateSearchPage(keyword, songs);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
