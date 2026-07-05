# GitHub 部署步骤（手机操作）

1. 在手机浏览器打开 github.com，登录你的账号
2. 点击右上角 + 号，选择 "New repository"
3. 仓库名填 gequhai，点 Create repository
4. 点击 "uploading an existing file"
5. 依次添加以下文件（注意文件路径要对）：
   - vercel.json
   - package.json
   - index.html
   - api/search.js
   - api/search-redirect.js
   - api/play.js
   - lib/generate-pages.js
   - static/ 文件夹下的所有文件
6. 点 Commit
7. 回到 Vercel，点 "Import Project"，连接 GitHub，选择 gequhai 仓库
8. 直接点 Deploy，等几分钟就能用了
