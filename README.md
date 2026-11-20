# 透镜 (TransEase) 官方网站与多端门户

本目录为 **透镜 (TransEase)** 的官方产品网站源码（纯静态、零冗余构建依赖，极致现代审美）。

---

## 目录结构

```text
TransEase-Web/
├── index.html           # 官网主页：Hero、交互式随动透镜沙盒、核心引擎展示、快捷指令速查、多端规划、下载与FAQ
├── privacy.html         # 隐私政策 (Privacy Policy)：符合苹果 App Store Review 5.1.1、Google Play 与国内合规标准
├── terms.html           # 服务条款与许可协议 (Terms of Service)
├── css/
│   └── style.css        # 现代化黑曜石与毛玻璃深色主题样式表
├── js/
│   └── main.js          # 交互脚本：鼠标随动透镜高精度模拟、FAQ 折叠展开、内测预约表单
├── assets/
│   ├── app-icon.png     # 1024×1024 高清应用图标
│   └── favicon.svg      # 矢量光学透镜 Favicon
└── README.md            # 本说明文件
```

---

## 本地预览

直接在浏览器中打开 `index.html`，或使用轻量 HTTP 服务器：

```bash
# 进入目录
cd /Users/Zhuanz/gemini-an/软件/TransEase-Web

# 启动本地实时预览服务 (Python 3 内置)
python3 -m http.server 8080
```
浏览器访问 `http://localhost:8080` 即可查看完整效果与交互动画。

---

## 一键免费部署方案

由于本站为纯静态现代 Web 架构，支持一键托管至主流平台：

1. **Cloudflare Pages / Vercel / Netlify**：
   - 将本文件夹推送到 GitHub 仓库；
   - 在 Cloudflare Pages 或 Vercel 中导入该仓库，构建设置留空，根目录选择 `./`，点击部署即可获得全球高速 CDN 加速及免费自定义域名与 SSL 证书。
2. **GitHub Pages**：
   - 仓库设置中开启 GitHub Pages，选择 `main` 分支根目录发布。
3. **独立服务器 (Nginx / Caddy)**：
   - 将本目录内容直接复制到网站根目录（如 `/var/www/transease`）即可。
