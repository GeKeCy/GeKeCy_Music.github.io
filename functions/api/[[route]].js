const API_MAP = {
    'search': { target: 'https://met.api.xiaoguan.fit/api', params: (url) => '?server=netease&type=search&id=' + encodeURIComponent(url.searchParams.get('keyword') || '') },
    'hot-detail': { target: 'https://music163.xuanmou.com.cn/search/hot/detail', params: () => '' },
    'toplist-artist': { target: 'https://music163.xuanmou.com.cn/toplist/artist', params: () => '' },
    'playlist-detail': { target: 'https://music163.xuanmou.com.cn/playlist/detail', params: (url) => '?id=' + (url.searchParams.get('id') || '') },
    'artist-list': { target: 'https://music163.xuanmou.com.cn/artist/list', params: (url) => `?cat=${url.searchParams.get('cat') || '5001'}&limit=${url.searchParams.get('limit') || '100'}&offset=${url.searchParams.get('offset') || '0'}` },
    'play-url': { target: 'https://api.paugram.com/netease/', params: (url) => '?id=' + encodeURIComponent(url.searchParams.get('id') || '') }
};

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

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/', '').replace(/\/$/, '');

    if (context.request.method === 'OPTIONS') {
        return corsOptionsResponse();
    }

    const apiInfo = API_MAP[path];
    if (!apiInfo) {
        return jsonResponse({ error: '未知的API路径: ' + path }, 404);
    }

    try {
        const targetUrl = apiInfo.target + apiInfo.params(url);
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            },
            cf: { cacheTtl: 300 }
        });

        if (!response.ok) {
            throw new Error('上游API返回 ' + response.status);
        }

        const data = await response.json();
        return jsonResponse(data);
    } catch (e) {
        return jsonResponse({ error: '代理请求失败: ' + e.message }, 500);
    }
}
