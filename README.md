# Ansen · GitHub Pages 客户预览版

## 上传与预览
1. 解压此 ZIP。在 GitHub 新建独立 Public 仓库，例如 `ansen-preview`，不要修改 Knox 的仓库。
2. 在新仓库点 **Add file → Upload files**，上传解压后的全部文件和文件夹，然后 **Commit changes**。仓库根目录应直接看到 `index.html`、`assets`、`images`、`fonts`；不要上传 ZIP，也不要多套一层文件夹。
3. 打开 **Settings → Pages**。Source 选 **Deploy from a branch**；Branch 选 **main**，目录选 **/(root)**，点击 **Save**。
4. 等待部署完成，复制 Pages 页面显示的实际网址给客户。通常为 `https://你的用户名.github.io/ansen-preview/`。如果账户主页配置了自定义域名，以 Pages 显示的地址为准。

## 版本说明
- 六个顶层页面、四个服务详情页和可点击的网站地图。
- 保留当前设计、首页雕塑位置调整、11 个真实作品截图、外部链接及手机导航。
- HTML、CSS、JavaScript 和本地图片/字体，无需 npm、服务器或数据库。
- Contact 是演示表单：不会发送或保存询问。正式上线需另接表单服务。
- 这是可公开访问的客户预览，不是密码保护网站。各页保留标题与描述，设为 noindex，避免与正式站争夺搜索结果；noindex 不是访问控制。
- 未写死预览域名；正式上线时再配置 canonical、结构化数据及 XML sitemap。当前 Sitemap 为可点击的 HTML 页面。
- 字体授权见 `fonts/OFL.txt`。预览包不含服务器代码、密钥或数据库。

GitHub 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
