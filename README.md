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

## 双主机

网站文件在仓库根目录，纯静态，无构建。两个主机并存，旧站继续负责现有客户端更新。

| 主机 | 地址 | 作用 |
| --- | --- | --- |
| GitHub Pages（已上线） | `https://liuh33494-droid.github.io/TransEase-web/` | 保持不动。`app 3.1.0` 写死的更新检查读这里的 `version.json`，安装包地址是其中的 `downloadUrl`。 |
| Cloudflare Workers Static Assets（新增） | Worker 名 `transease-web`，部署后使用账号已有的 `workers.dev` 子域 | 同一批 HTML / CSS / JS / `version.json` / `downloads` 的第二副本。不购买域名，不改 DNS。 |

`wrangler.jsonc` 只声明静态资源：`assets.directory` 为仓库根目录，`html_handling` 为 `none`。没有用户 Worker 脚本，因此没有 `main`、`assets.binding` 或 `run_worker_first`。Wrangler 部署时会自行附带约 0.35 KiB 的内部 no-op 脚本，只在没有匹配到文件时返回 404；不要把这份脚本写进仓库。找不到的路径（含缺失的 JSON 和安装包）返回 404，不会回落到 `index.html`。`_headers` 把 `/version.json` 固定为 `Cache-Control: public, max-age=0, must-revalidate`。`.assetsignore` 排除 `.git`、`.github`、Wrangler 配置、README 和凭据文件，不排除网站与安装包。`_redirects` 只有一条内部重写：`/ /index.html 200`。浏览器地址保持 `/`，状态码是 200，不是 301/302/307。`/index.html`、`/version.json` 和 `downloads/` 不跳转。

### 更新安全

- 不要修改 `version.json` 的 `downloadUrl`。它必须保持 `https://liuh33494-droid.github.io/TransEase-web/downloads/TransEase_macOS.dmg`。
- 不要改 `downloads/` 里已发布安装包的字节，也不要给这些 URL 或 `version.json` 加跳转。
- 不要改 `.github/workflows/static.yml`、GitHub Pages 的分支或仓库 Pages 设置。
- 页面链接是相对路径（`css/style.css`、`js/main.js`、`downloads/…`、`privacy.html`）。保持 `html_handling: none`，避免把 `/privacy.html` 307 到 `/privacy` 后改变相对路径的基准。

### 测试

本地预览仍可用 `python3 -m http.server 8080`。检查 Workers 资源清单（不上传、不部署）：

```bash
npx wrangler deploy --dry-run --outdir /tmp/transease-web-dry-run
```

用 `npx wrangler dev` 再确认：`/` 与 `/index.html` 的 HTML 一致；`/version.json` 为 200 且 `Cache-Control` 含 `max-age=0`；安装包路径为 200 且字节与仓库一致；`/missing.json` 和 `/downloads/missing.bin` 为 404，响应体不是首页。

### 回滚

Workers 回滚只影响 `transease-web`：在 Cloudflare 控制台对该 Worker 执行 Rollback，或在已登录环境运行 `npx wrangler rollback`。这不会改 GitHub Pages。撤掉本仓库的部署配置时，还原添加 `wrangler.jsonc`、`.assetsignore`、`_headers`、`_redirects` 和 `.gitignore` 的提交即可。不要删除 `.github/workflows/static.yml`。

Workers Builds 的生产分支若保持默认 `main`，则只有本配置合并进 `main` 之后，Git 构建才会部署它。合并需要单独批准。

### Workers Builds（由已登录的 Cloudflare 连接器配置，不要写入账号 ID 或令牌）

只连接 `liuh33494-droid/TransEase-web`。

| 设置 | 值 |
| --- | --- |
| Worker 名称 | `transease-web`（以 `wrangler.jsonc` 为准） |
| Production branch | `main`（合并前不要对当前 `main` 触发生产构建；当前 `main` 没有这份配置） |
| Build command | 留空 |
| Deploy command | `npx wrangler deploy` |
| Root directory | 仓库根目录 `/` |
| Preview builds | 关闭，除非另行批准部署 |
| 自定义域 / DNS / 环境变量 / 绑定 | 不设置 |

## 其他静态拷贝

独立服务器（Nginx / Caddy）把本目录内容复制到网站根目录（如 `/var/www/transease`）即可。复制时不必包含 `wrangler.jsonc` 与 `.github`。
