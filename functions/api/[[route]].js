// Cloudflare Pages Functions - 音乐API代理
// 绕过CORS限制，前端通过 /api/xxx 调用

const API_MAP = {
    // 搜索歌曲
    'search': {
        target: 'https://met.api.xiaoguan.fit/api',
        params: (url) => {
            return '?server=netease&type=search&id=' + encodeURIComponent(url.searchParams.get('keyword') || '');
        }
    },
    // 热搜详情
    'hot-detail': {
        target: 'https://music163.xuanmou.com.cn/search/hot/detail',
        params: () => ''
    },
    // 歌手榜
    'toplist-artist': {
        target: 'https://music163.xuanmou.com.cn/toplist/artist',
        params: () => ''
    },
    // 歌单详情
    'playlist-detail': {
        target: 'https://music163.xuanmou.com.cn/playlist/detail',
        params: (url) => '?id=' + (url.searchParams.get('id') || '')
    },
    // 歌手列表
    'artist-list': {
        target: 'https://music163.xuanmou.com.cn/artist/list',
        params: (url) => {
            const cat = url.searchParams.get('cat') || '5001';
            const limit = url.searchParams.get('limit') || '100';
            const offset = url.searchParams.get('offset') || '0';
            return '?cat=' + cat + '&limit=' + limit + '&offset=' + offset;
        }
    },
    // 播放地址
    'play-url': {
        target: 'https://api.paugram.com/netease/',
        params: (url) => '?id=' + encodeURIComponent(url.searchParams.get('id') || '')
    }
};

export async function onRequest(context) {
    const url = new URL(context.request.url);
    // 路径格式: /api/search, /api/hot-detail 等
    const path = url.pathname.replace('/api/', '').replace(/\/$/, '');

    // 处理 CORS 预检请求
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            }
        });
    }

    const apiConfig = API_MAP[path];
    if (!apiConfig) {
        return new Response(JSON.stringify({ error: '未知的API路径: ' + path }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const targetUrl = apiConfig.target + apiConfig.params(url);
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://music.163.com/'
            }
        });

        const data = await response.text();
        return new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=300'
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: '代理请求失败: ' + e.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
