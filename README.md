# mcim-website-v2

MCIM 主站：首页、同步状态、接口参考、接入指南、赞助。Nuxt 4 加 MDUI。

## 本地开发

```
npm install
npm run mock     # 夹具服务，代替 rust-sync 的任务接口，监听 9901
npm run dev      # 需要 NUXT_SYNC_API_BASE=http://127.0.0.1:9901
npm run scheme   # 改了品牌色后重新生成 app/assets/css/scheme.scss
```

## 环境变量

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `NUXT_MCIM_API_BASE` | `https://mod.mcimirror.top` | rust-api 基地址 |
| `NUXT_SYNC_API_BASE` | 无 | rust-sync 任务接口基地址，缺失时状态页显示未知 |
| `NUXT_UPSTREAM_USER_AGENT` | `mcim-website/<version> (+仓库地址)` | 上游请求的 User-Agent |
| `NUXT_UPSTREAM_TIMEOUT_MS` | `5000` | 单次上游请求超时 |
| `NUXT_PUBLIC_SITE_URL` | `https://www.mcimirror.top` | canonical 与 OG |
| `NUXT_PUBLIC_API_URL` | `https://mod.mcimirror.top` | 页面里展示的 API 地址 |
| `NUXT_PUBLIC_SITE_COMMIT` | 构建时取 git 短哈希 | 无 git 时由构建参数注入，页脚与 User-Agent 都用它 |
| `NUXT_PUBLIC_STRIPE_BUY_BUTTON_ID`、`NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 现值 | Stripe 公开值 |
