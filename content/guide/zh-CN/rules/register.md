---
title: 接入登记
description: 接入前登记启动器名与 User-Agent。
order: 1
---

镜像可能会启用 User-Agent 白名单。接入前请到 [启动器信息](https://github.com/mcmod-info-mirror/mcim-rust-api/issues/12) 留言，写明启动器名与使用的 User-Agent。

## User-Agent 格式

推荐 `名称/版本号`，例如：

```
HMCL/3.6.0
ColorMC/1.0.0
SJMCL/0.1.0
```

名称固定，版本号随发布更新。请求镜像时始终带上这个 UA，不要用空 UA 或 HTTP 库的默认 UA。

## 其他约定

- 不要在镜像上做二次封装，见 [声明](/guide/rules/policy)。
- 合理设置并发与重试，不要对镜像发起压力测试。
