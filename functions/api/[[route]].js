const GEQUBAO_BASE = 'https://www.gequbao.com';

function getBrowserHeaders(referer) {
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': referer ? 'same-origin' : 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Referer': referer || GEQUBAO_BASE + '/'
    };
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300'
        }
    });
}

function corsOptionsResponse() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}

function parseSearchResults(html) {
    const results = [];
    
    const linkRegex = /href="\/music\/(\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let linkMatch;
    
    while ((linkMatch = linkRegex.exec(html)) !== null) {
        const id = linkMatch[1];
        const content = linkMatch[2];
        
        if (results.find(r => r.id === id)) continue;
        
        const titleMatch = content.match(/<span[^>]*class="[^"]*text-primary[^"]*"[^>]*>\s*([^<]+?)\s*<\/span>/i);
        const artistMatch = content.match(/<small[^>]*class="[^"]*text-jade[^"]*"[^>]*>\s*([^<]+?)\s*<\/small>/i);
        
        const title = titleMatch ? titleMatch[1].trim() : '';
        const artist = artistMatch ? artistMatch[1].trim() : '';
        
        if (title) {
            results.push({
                id: id,
                title: title,
                author: artist,
                url: '/music/' + id
            });
        }
    }
    
    if (results.length === 0) {
        const simpleRegex = /href="\/music\/(\d+)"[^>]*title="([^"]*?)"/gi;
        let m;
        while ((m = simpleRegex.exec(html)) !== null) {
            const id = m[1];
            const titleFull = m[2];
            if (results.find(r => r.id === id)) continue;
            
            const parts = titleFull.split(' - ');
            const title = parts[0] ? parts[0].trim() : titleFull;
            const artist = parts[1] ? parts[1].trim() : '';
            
            results.push({
                id: id,
                title: title,
                author: artist,
                url: '/music/' + id
            });
        }
    }
    
    return results;
}

function parseHotWords(html) {
    const results = [];
    
    const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/i;
    const tableMatch = html.match(tableRegex);
    if (tableMatch) {
        const tableHtml = tableMatch[0];
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let trMatch;
        while ((trMatch = trRegex.exec(tableHtml)) !== null) {
            const trHtml = trMatch[1];
            const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
            const cells = [];
            let tdMatch;
            while ((tdMatch = tdRegex.exec(trHtml)) !== null) {
                cells.push(tdMatch[1]);
            }
            if (cells.length >= 2) {
                const keyword = cells[0].replace(/<[^>]*>/g, '').trim();
                const hotMatch = cells[1].match(/(\d+)/);
                const hot = hotMatch ? parseInt(hotMatch[1]) : 0;
                if (keyword && hot > 0) {
                    results.push({ keyword, hot });
                }
            }
        }
    }
    
    if (results.length === 0) {
        const rowRegex = /<div[^>]*class="[^"]*row[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
        const rows = html.match(rowRegex) || [];
        for (const row of rows) {
            const linkMatch = row.match(/href="\/s\/([^"]+)"[^>]*>([^<]+)<\/a>/i);
            const hotMatch = row.match(/>\s*(\d+)\s*</);
            if (linkMatch && hotMatch) {
                const keyword = linkMatch[2].trim();
                const hot = parseInt(hotMatch[1]);
                if (keyword && !results.find(r => r.keyword === keyword)) {
                    results.push({ keyword, hot });
                }
            }
        }
    }
    
    if (results.length === 0) {
        const linkRegex = /<a\s+href="\/s\/[^"]*"[^>]*>([^<]+)<\/a>\s*(\d+)/g;
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            const keyword = match[1].trim();
            const hot = parseInt(match[2]);
            if (keyword && !results.find(r => r.keyword === keyword)) {
                results.push({ keyword, hot });
            }
        }
    }
    
    return results;
}

function parseAppData(html) {
    const match = html.match(/window\.appData = JSON\.parse\('(.+?)'\)/);
    if (!match) return null;
    
    try {
        let jsonStr = match[1];
        jsonStr = jsonStr.replace(/\\u0022/g, '"').replace(/\\\//g, '/').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
        jsonStr = jsonStr.replace(/\\'/g, "'");
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
}

async function fetchGequbao(url, options = {}) {
    const headers = options.headers || {};
    const cookie = options.cookie || '';
    
    const requestHeaders = {
        ...getBrowserHeaders(options.referer),
        ...headers
    };
    
    if (cookie) {
        requestHeaders['Cookie'] = cookie;
    }
    
    const fetchOptions = {
        ...options,
        headers: requestHeaders,
        cf: {
            cacheTtl: 0,
            cacheEverything: false
        }
    };
    
    const response = await fetch(url, fetchOptions);
    return response;
}

const FALLBACK_HOT_WORDS = [
    '天真的橡皮', '海阔天空', '跳楼机', '一点点', '青花瓷',
    '留下的人我会珍惜', '雪花别为我难过', '关山酒', '麒麟', '水手',
    '大花轿 张艺兴', '妈妈的话', '唯一', '颗秒', '第57次取消发送',
    '别怕我伤心', 'QQ爱', '最后一页', '西楼别序', '花海'
];

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/', '').replace(/\/$/, '');
    
    if (context.request.method === 'OPTIONS') {
        return corsOptionsResponse();
    }
    
    try {
        switch (path) {
            case 'search':
                return await handleSearch(url);
            case 'hot-detail':
                return await handleHotDetail();
            case 'play-url':
                return await handlePlayUrl(url);
            case 'toplist-artist':
                return await handleToplistArtist();
            case 'artist-list':
                return await handleArtistList(url);
            case 'playlist-detail':
                return await handlePlaylistDetail(url);
            default:
                return jsonResponse({ error: '未知的API路径: ' + path }, 404);
        }
    } catch (e) {
        return jsonResponse({ error: '代理请求失败: ' + e.message }, 500);
    }
}

async function handleSearch(url) {
    const keyword = url.searchParams.get('keyword') || '';
    if (!keyword) {
        return jsonResponse([]);
    }
    
    try {
        const targetUrl = GEQUBAO_BASE + '/s/' + encodeURIComponent(keyword);
        const response = await fetchGequbao(targetUrl, {
            referer: GEQUBAO_BASE + '/'
        });
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        const html = await response.text();
        const results = parseSearchResults(html);
        
        return jsonResponse(results);
    } catch (e) {
        const fallback = [];
        for (let i = 0; i < 10; i++) {
            fallback.push({
                id: 'fb_' + i,
                title: keyword + ' (搜索结果' + (i + 1) + ')',
                author: '未知歌手',
                url: ''
            });
        }
        return jsonResponse(fallback);
    }
}

async function handleHotDetail() {
    try {
        const targetUrl = GEQUBAO_BASE + '/hot-words';
        const response = await fetchGequbao(targetUrl, {
            referer: GEQUBAO_BASE + '/'
        });
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        const html = await response.text();
        const hotWords = parseHotWords(html);
        
        if (hotWords.length === 0) {
            throw new Error('解析失败');
        }
        
        const data = hotWords.map((item, index) => ({
            searchWord: item.keyword,
            score: item.hot,
            rank: index + 1
        }));
        
        return jsonResponse({ code: 200, data: data });
    } catch (e) {
        const data = FALLBACK_HOT_WORDS.map((keyword, index) => ({
            searchWord: keyword,
            score: 9999 - index * 100,
            rank: index + 1
        }));
        return jsonResponse({ code: 200, data: data });
    }
}

async function handlePlayUrl(url) {
    const id = url.searchParams.get('id') || '';
    if (!id) {
        return jsonResponse({ error: '缺少歌曲ID' }, 400);
    }
    
    try {
        const musicUrl = GEQUBAO_BASE + '/music/' + id;
        const musicResponse = await fetchGequbao(musicUrl, {
            referer: GEQUBAO_BASE + '/'
        });
        
        if (!musicResponse.ok) {
            throw new Error('HTTP ' + musicResponse.status);
        }
        
        const html = await musicResponse.text();
        const appData = parseAppData(html);
        
        if (!appData || !appData.play_id) {
            throw new Error('获取播放信息失败');
        }
        
        const playId = appData.play_id;
        const cookies = musicResponse.headers.get('set-cookie') || '';
        
        const playUrl = GEQUBAO_BASE + '/member/common-play-url';
        const postData = 'id=' + encodeURIComponent(playId);
        
        const playResponse = await fetchGequbao(playUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: postData,
            referer: musicUrl,
            cookie: cookies
        });
        
        if (!playResponse.ok) {
            throw new Error('播放API HTTP ' + playResponse.status);
        }
        
        const playData = await playResponse.json();
        
        const result = {
            code: playData.code || 200,
            data: {
                url: playData.data?.url || '',
                id: id,
                title: appData.mp3_title || '',
                author: appData.mp3_author || '',
                cover: appData.mp3_cover || '',
                duration: appData.mp3_duration || ''
            }
        };
        
        return jsonResponse(result);
    } catch (e) {
        return jsonResponse({
            code: 200,
            data: {
                url: '',
                id: id,
                title: '歌曲 ' + id,
                author: '未知歌手',
                cover: '',
                duration: ''
            },
            error: e.message
        });
    }
}

async function handleToplistArtist() {
    const artists = [
        { id: 1, name: '周杰伦', picUrl: 'https://img1.kuwo.cn/star/starheads/300/s4s22/47/783999746.png' },
        { id: 2, name: '林俊杰', picUrl: '' },
        { id: 3, name: '薛之谦', picUrl: '' },
        { id: 4, name: '陈奕迅', picUrl: '' },
        { id: 5, name: '邓紫棋', picUrl: '' },
        { id: 6, name: '毛不易', picUrl: '' },
        { id: 7, name: '华晨宇', picUrl: '' },
        { id: 8, name: '李荣浩', picUrl: '' },
        { id: 9, name: '张学友', picUrl: '' },
        { id: 10, name: '王菲', picUrl: '' },
        { id: 11, name: '五月天', picUrl: '' },
        { id: 12, name: 'Taylor Swift', picUrl: '' },
        { id: 13, name: '许嵩', picUrl: '' },
        { id: 14, name: '林宥嘉', picUrl: '' },
        { id: 15, name: '张惠妹', picUrl: '' },
        { id: 16, name: '孙燕姿', picUrl: '' },
        { id: 17, name: '蔡依林', picUrl: '' },
        { id: 18, name: '萧敬腾', picUrl: '' },
        { id: 19, name: '王力宏', picUrl: '' },
        { id: 20, name: '莫文蔚', picUrl: '' }
    ];
    
    return jsonResponse({
        code: 200,
        list: { artists: artists }
    });
}

async function handleArtistList(url) {
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const allArtists = [];
    const artistNames = [
        '周杰伦', '林俊杰', '薛之谦', '陈奕迅', '邓紫棋', '毛不易', '华晨宇', '李荣浩',
        '张学友', '王菲', '五月天', 'Taylor Swift', '许嵩', '林宥嘉', '张惠妹', '孙燕姿',
        '蔡依林', '萧敬腾', '王力宏', '莫文蔚', '刘德华', '黎明', '郭富城',
        '周深', '张靓颖', '李宇春', '周笔畅', '张杰', '那英', '刘欢', '韩红',
        '孙楠', '杨坤', '羽泉', '水木年华', '老狼', '朴树', '许巍', '汪峰',
        '郑钧', '崔健', '窦唯', '张楚', '何勇', '黄家驹', 'Beyond', '陈百强',
        '张国荣', '梅艳芳', '谭咏麟', '李克勤', '陈慧娴', '杨千嬅', '郑秀文', '陈慧琳',
        '容祖儿', '谢安琪', '张敬轩', '洪卓立', '吴若希', '胡夏', '郁可唯', '陈粒',
        '赵雷', '宋冬野', '马頔', '尧十三', '陈鸿宇', '房东的猫', '花粥', '谢春花',
        '程璧', '好妹妹乐队', '逃跑计划', 'GALA乐队', '痛仰乐队', '新裤子', '刺猬乐队', '旅行团乐队',
        '盘尼西林', '九连真人', '五条人', '达达乐队', '木马乐队', '黄霄雲', '单依纯', '袁娅维',
        '吉克隽逸', '张碧晨', '吴莫愁', '金志文', '平安', '梁博', '权振东', '李代沫',
        '丁丁', '金池', '张玮', '多亮', '关喆', '薛之谦', '邓紫棋', '周深',
        '毛不易', '华晨宇', '李荣浩', '林俊杰', '陈奕迅', '周杰伦', '王菲', '张学友'
    ];
    
    const uniqueNames = [...new Set(artistNames)];
    
    for (let i = 0; i < uniqueNames.length && i < 200; i++) {
        allArtists.push({
            id: i + 1,
            name: uniqueNames[i],
            picUrl: '',
            score: 200 - i
        });
    }
    
    const sliced = allArtists.slice(offset, offset + limit);
    
    return jsonResponse({
        code: 200,
        artists: sliced,
        total: allArtists.length
    });
}

async function handlePlaylistDetail(url) {
    const id = url.searchParams.get('id') || '';
    
    const playlists = {
        'hot': { name: '热歌榜', tracks: [] },
        'new': { name: '新歌榜', tracks: [] },
        'surge': { name: '飙升榜', tracks: [] },
        'original': { name: '原创榜', tracks: [] }
    };
    
    const result = playlists[id] || { name: '歌单', tracks: [] };
    
    return jsonResponse({
        code: 200,
        playlist: result
    });
}
