/**
 * Gequhai Music Search - Server-Side Page Generation
 * Extracted from server.js for Vercel Serverless Functions
 */

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateCommonHead(title) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${escapeHtml(title)}</title>
    <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon">
    <link href="/static/css/common.css" rel="stylesheet">
    <link href="//lib.baomitu.com/twitter-bootstrap/4.6.1/css/bootstrap.min.css" type="text/css" rel="stylesheet">
    <link href="//lib.baomitu.com/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" rel="stylesheet">
    <link href="//lib.baomitu.com/jquery-confirm/3.3.4/jquery-confirm.min.css" type="text/css" rel="stylesheet">
    <script src="//lib.baomitu.com/jquery/3.6.0/jquery.min.js" type="application/javascript"></script>
    <script defer src="//lib.baomitu.com/twitter-bootstrap/4.6.1/js/bootstrap.min.js" type="application/javascript"></script>
    <script defer src="//lib.baomitu.com/jquery-confirm/3.3.4/jquery-confirm.min.js" type="application/javascript"></script>
    <style>
        .pl-1, .px-1 { padding-left: 0.5rem !important; }
        .pr-1, .px-1 { padding-right: 0.7rem !important; }
        p { margin-top: 26px; }
        .badge { margin-right: 3px; display: inline-block; padding: .25em .6em; font-size: 75%; font-weight: 700; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.7rem; }
        .card { margin-top: 15px; position: relative; display: -ms-flexbox; display: flex; -ms-flex-direction: column; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0, 0, 0, .125); border-radius: .5rem; font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, STHeiTi, sans-serif; font-size: 15px; }
        .btn-custom { background-color: #31c27c; border-color: #31c27c; color: white; border-radius: 0 0.25rem 0.25rem 0 !important; height: 40px; }
        .btn-custom:hover { background-color: #31c27c; border-color: #31c27c; }
        .reddot:after { content: ""; background: #31c27c; border: 1px solid #31c27c; border-radius: 50%; padding: 3px; position: absolute; }
        a { color: #333; text-decoration: none; background-color: transparent; }
        a:hover { color: #31c27c; text-decoration: underline; }
        .form-control:focus { background-color: #fff; border-color: #31c27c; outline: 0; box-shadow: 0 0 0 .2rem #31c27c38; }
        .form-control { border: 1px solid #31c27c; }
        .text-white { color: #999 !important; }
        footer .text-white { font-size: 14px !important; }
        footer .nav-link { font-size: 13px !important; }
        .navbar-h1 { display: inline; font-size: 1.5rem; font-weight: 700; }
        .quote-warning { border-left: 4px solid #31c27c; background-color: #f8f9fa; padding: .5rem; color: #434343; }
        .table { width: 100%; margin-bottom: 0rem; color: #212529; }
        .table td, .table th { font-size: 15px; color: #999; padding: 1.15rem; vertical-align: middle; border-top: 0px solid #dee2e6; }
        .table-striped tbody tr:nth-child(odd) { background-color: #ffffff; }
        .table-striped tbody tr:nth-child(even) { background-color: #fafafa; }
        .table-striped tbody tr:hover { background-color: #f5f5f5; }
        .table thead th { vertical-align: bottom; border-bottom: 0px solid #dee2e6; }
        .text-info { color: #333 !important; }
        .font-weight-bold { font-weight: 545 !important; font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, STHeiTi, sans-serif; font-size: 15px; line-height: 1; }
    </style>`;
}

function generateNavbar(keyword) {
  return `
<nav class="navbar navbar-expand-md navbar-light bg-white px-0 mb-1 font-weight-normal">
    <a class="navbar-brand font-weight-bolder" style="font-size: 1.5rem; color: #50514F;" href="/">
        <img src="/static/img/logo.png" width="38" height="38" class="d-inline-block align-middle" alt="Logo" style="margin: 5px;margin-bottom: 10px;">
        <h1 class="navbar-h1">歌曲海</h1>
        <span class="text-muted" style="font-size: smaller">Gequhai.com</span>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">排行</a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown" style="border-top: 0.15rem solid #31c27c;">
                    <a class="dropdown-item" href="javascript:void(0)">热门榜</a>
                    <a class="dropdown-item" href="javascript:void(0)">歌手榜</a>
                    <a class="dropdown-item" href="javascript:void(0)">飙升榜</a>
                    <a class="dropdown-item" href="javascript:void(0)">新歌榜</a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/"><i class="fa fa-search"></i> 搜索</a>
            </li>
        </ul>
    </div>
</nav>`;
}

function generateSearchForm(keyword) {
  return `
<form method="GET" action="/s/" style="margin-top: 1rem !important;margin-bottom: .5rem !important;">
    <div class="input-group">
        <input type="text" name="keyword" class="form-control text-center border border-info" placeholder="请输入歌名/歌手名" value="${escapeHtml(keyword)}" style="border-right-color: #31c27c !important;border-radius: 0.25rem 0 0 0.25rem !important;height: 40px;">
        <button type="submit" class="btn btn-custom shadow-sm rounded-sm btn-block mb-1" style="width: 20%;padding: 0px;">
            搜索 <i class="fa fa-search"></i>
        </button>
    </div>
</form>`;
}

function generateFooter() {
  return `
<footer class="bg-dark py-1 my-0 border-top mt-4">
    <div class="container" style="max-width: 900px;">
        <div class="mt-1 d-flex flex-wrap justify-content-center align-items-center">
            <a href="/" class="text-white text-center">歌曲海 - gequhai.com &copy; 2026</a>
            <ul class="nav col-md-4 justify-content-center" style="width: auto;padding-right: 0px;">
                <li class="nav-item mx-1"><a href="javascript:void(0)" class="nav-link px-2 text-white">网站地图</a></li>
                <li class="nav-item mx-1"><a href="javascript:void(0)" class="nav-link px-2 text-white">免责声明</a></li>
            </ul>
        </div>
    </div>
</footer>`;
}

/**
 * Generate search results page HTML
 * @param {string} keyword - Search keyword
 * @param {Array} songs - Array of song objects from Meting API
 * @returns {string} Complete HTML page
 */
function generateSearchPage(keyword, songs) {
  // Build table rows from songs array
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

  const head = generateCommonHead('搜索 ' + keyword + ' - 歌曲海');
  const navbar = generateNavbar(keyword);
  const searchForm = generateSearchForm(keyword);
  const footer = generateFooter();

  return `${head}
</head>
<body>
<div class="container" style="max-width: 900px">
    ${navbar}
    ${searchForm}

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
${footer}
</body>
</html>`;
}

/**
 * Generate play page HTML
 * @param {Object|null} data - Song data from Paugram API
 * @param {string} fallbackSongId - Song ID for error display
 * @returns {string} Complete HTML page
 */
function generatePlayPage(data, fallbackSongId) {
  const songId = fallbackSongId || '';
  const head = generateCommonHead('歌曲播放 - 歌曲海');
  const navbar = generateNavbar('');
  const footer = generateFooter();

  // Add APlayer CSS
  const aplayerCss = `    <link href="//lib.baomitu.com/aplayer/1.10.1/APlayer.min.css" rel="stylesheet">`;

  // Add play page specific styles
  const playStyles = `
    <style>
        .aplayer-container { width: 80%; max-width: 800px; position: relative; }
        .content-lrc { min-height: 21rem; max-height: 21rem; overflow: hidden; font-family: "Microsoft YaHei", sans-serif; background-color: #ffffff; line-height: 1.8; color: #555; margin-bottom: 10px; letter-spacing: 0.01em; padding-left: 5px; }
        .expand { text-align: center; cursor: pointer; color: #009688; }
        .height-auto { max-height: unset; }
        .nowrap-hidden { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .aplayer-notice { z-index: 2; }
        .aplayer .aplayer-lrc p.aplayer-lrc-current { color: #FF6666; opacity: 1; overflow: visible; height: auto !important; min-height: 16px; }
        @media (min-width: 768px) { .aplayer .aplayer-lrc p.aplayer-lrc-current { font-size: 17px; } }
        @media (max-width: 767.98px) { .aplayer .aplayer-lrc p.aplayer-lrc-current { font-size: 14px; } }
        .aplayer .aplayer-lrc p { font-weight: 700; font-size: 13px; color: #777; line-height: 21px !important; height: 16px !important; padding: 0 !important; margin: 0 !important; transition: all 0.5s ease-out; opacity: .4; overflow: hidden; }
        .aplayer-pic { transition: transform 2s linear infinite; }
        .aplayer-pic.rotating { animation: rotate 30s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .aplayer .aplayer-pic .aplayer-pause { display: none; width: 16px; height: 16px; border: 2px solid #fff; bottom: 40%; right: 40%; }
        .aplayer.aplayer-withlrc .aplayer-pic { height: 74px; width: 74px; border-radius: 50%; margin: 19px; position: relative; z-index: 2; }
        .aplayer::before { content: ""; position: absolute; width: 112px; height: 112px; background-image: url("/static/img/play.png"); background-size: cover; background-repeat: no-repeat; border-radius: 50%; z-index: 2; pointer-events: none; animation: none !important; }
        .aplayer { background: #ffffff; font-family: Arial, Helvetica, sans-serif; margin: 0px; box-shadow: 0 0 0 0 rgba(0,0,0,.07), 0 0 0 0 rgba(0,0,0,.1); border-radius: 43px 10px 10px 43px; overflow: hidden; -webkit-user-select: none; user-select: none; line-height: normal; position: relative; }
        .aplayer.aplayer-withlrc .aplayer-info { margin-left: 120px; height: 90px; padding: 5px 0px 0; }
        .aplayer .aplayer-lrc { display: none; position: relative; height: 38px; text-align: center; overflow: hidden; margin: 9px 0 13px; }
        .aplayer .aplayer-info .aplayer-music { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin: 6px 0 6px 12px; user-select: text; cursor: default; padding-bottom: 2px; height: 20px; }
        .aplayer .aplayer-lrc:before { top: 0; height: 5%; background: linear-gradient(180deg, #fff 0, hsla(0,0%,100%,0)); }
        .aplayer-author a { text-decoration: none; color: inherit; }
        .download-button { background-color: #31c27c !important; color: white !important; border: none !important; }
        .error-box { border-left: 4px solid #ff5252; background-color: #fff5f5; padding: 1rem; color: #d32f2f; border-radius: 4px; margin: 15px 0; }
    </style>`;

  // Add APlayer JS
  const aplayerJs = `    <script defer src="//lib.baomitu.com/aplayer/1.10.1/APlayer.min.js" type="application/javascript"></script>`;

  let songName, artistName, mp3Url, coverUrl, lrcText, pageTitle, downloadMp3Href;
  let lyricsHtml = '';

  if (data && data.title) {
    songName = data.title || '未知歌曲';
    artistName = data.artist || '未知歌手';
    mp3Url = data.link || '';
    coverUrl = data.cover || 'https://img2.kuwo.cn/star/albumcover/500/s4s86/95/3059703046.jpg';
    lrcText = data.lyric || '';
    pageTitle = songName + '-' + artistName + '-MP3播放-歌曲海';
    downloadMp3Href = mp3Url || 'javascript:void(0)';

    // Parse lyrics for display
    if (lrcText) {
      const lines = lrcText.split('\n');
      const plainLyrics = [];
      for (const line of lines) {
        const textPart = line.replace(/\[\d{2}:\d{2}(\.\d{2,3})?\]/g, '').trim();
        if (textPart) plainLyrics.push(escapeHtml(textPart));
      }
      lyricsHtml = `
<div class="card shadow-sm mb-3">
    <div class="card-body">
        <div style="display: block">
            <div class="content-lrc mt-1" id="content-lrc">${plainLyrics.join('<br>')}</div>
        </div>
        <div class="expand" data-status="up" onclick="var c=document.getElementById('content-lrc');var e=this;if(e.dataset.status==='up'){c.style.maxHeight='unset';e.dataset.status='down';e.textContent='收起';}else{c.style.maxHeight='21rem';e.dataset.status='up';e.textContent='查看全部';}">查看全部</div>
        <br>
        <div class="quote-warning mb-4">
            <i class="fa fa-info-circle"></i>
            如在线播放和下载错误，请更换浏览器刷新重试。
        </div>
    </div>
</div>`;
    }
  } else {
    songName = '未知歌曲';
    artistName = '';
    mp3Url = '';
    coverUrl = 'https://img2.kuwo.cn/star/albumcover/500/s4s86/95/3059703046.jpg';
    lrcText = '';
    pageTitle = '歌曲播放 - 歌曲海';
    downloadMp3Href = 'javascript:void(0)';
  }

  // Build APlayer init script
  const lrcJsString = lrcText ? lrcText.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '') : '';

  const aplayerInit = `
    <script type="text/javascript">
    window.onload = function() {
        var apContainer = document.getElementById('aplayer');
        if (typeof APlayer !== 'undefined') {
            window.ap = new APlayer({
                container: apContainer,
                autoplay: false,
                theme: '#FF5555',
                lrcType: 3,
                preload: 'metadata',
                loop: 'none',
                order: 'list',
                volume: 0.5,
                audio: [{
                    name: ${JSON.stringify(songName)},
                    artist: ${JSON.stringify(artistName)},
                    url: ${JSON.stringify(mp3Url)},
                    cover: ${JSON.stringify(coverUrl)},
                    lrc: \`${lrcJsString}\`,
                    theme: '#FF5555'
                }]
            });
            var cover = document.querySelector('.aplayer-pic');
            if (cover) {
                ap.on('play', function() { cover.classList.add('rotating'); });
                ap.on('pause', function() { cover.classList.remove('rotating'); });
            }
            if (!${JSON.stringify(mp3Url)}) {
                setTimeout(function() {
                    if (ap) {
                        ap.notice('<span style="color:#FF5722;font-weight:bold"><i class="fa fa-exclamation-circle"></i> 无法获取播放链接，可能是网络问题或该歌曲需要VIP</span>', 5000, 1);
                    }
                }, 1000);
            }
        }
    };
    </script>`;

  // LRC download script
  const lrcDownloadScript = lrcText ? `
    <script type="text/javascript">
    document.getElementById('btn-download-lrc').addEventListener('click', function(e) {
        e.preventDefault();
        var lrcText = \`${lrcJsString}\`;
        var blob = new Blob([lrcText], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = ${JSON.stringify(songName + '-' + artistName + '-歌词.lrc')};
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    </script>` : '';

  const playerContent = (data && data.title) ? `
    <div id="player-area">
        <div id="aplayer" class="aplayer aplayer-withlrc"></div>
        <br>
        <div class="input-group mb-1 overflow-hidden" style="margin-bottom: 0.9rem !important;">
            <div class="input-group-prepend">
                <i class="fa fa-music input-group-text" style="color: #ffffff;background-color: #31c27c !important;border: 1px solid #31c27c;padding: .55rem .75rem;border-radius: 0;"></i>
            </div>
            <h1 class="form-control bg-light nowrap-hidden" style="color: #ffffff;background-color: #31c27c !important;border: 1px solid #31c27c;">${escapeHtml(songName)}-${escapeHtml(artistName)}.mp3</h1>
            <div class="input-group-append">
                <a id="btn-download-mp3" class="btn btn-custom" href="${escapeHtml(downloadMp3Href)}" target="_blank">
                    <i class="fa fa-download"></i>
                    <span class="download-text">下载歌曲</span>
                </a>
            </div>
        </div>
        <div class="input-group overflow-hidden">
            <div class="input-group-prepend">
                <i class="fa fa-file-text-o input-group-text" style="color: #ffffff; background-color: #31c27c !important;border: 1px solid #31c27c;padding: .55rem .75rem;border-radius: 0;"></i>
            </div>
            <h2 class="form-control bg-light nowrap-hidden" style="color: #ffffff;background-color: #31c27c !important;border: 1px solid #31c27c;">
                ${escapeHtml(songName)}-${escapeHtml(artistName)}-歌词.lrc
            </h2>
            <div class="input-group-append">
                <a id="btn-download-lrc" class="btn btn-custom" href="javascript:void(0)">
                    <i class="fa fa-download"></i>
                    <span class="download-text">下载歌词</span>
                </a>
            </div>
        </div>
    </div>` : `
    <div class="error-box">
        <i class="fa fa-exclamation-circle"></i>
        歌曲加载失败（ID: ${escapeHtml(songId)}），请稍后再试
    </div>`;

  return `${head}
${aplayerCss}
${playStyles}
${aplayerJs}
</head>
<body>
<div class="container" style="max-width: 900px">
    ${navbar}

    <div class="row mb-2"></div>

    <div class="card shadow-sm mb-3">
        <div class="card-body">
            ${playerContent}
        </div>
    </div>

    ${lyricsHtml}
</div>
${footer}
${aplayerInit}
${lrcDownloadScript}
</body>
</html>`;
}

module.exports = { generateSearchPage, generatePlayPage };
