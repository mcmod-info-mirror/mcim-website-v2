---
title: Modrinth
description: api.modrinth.com 与 cdn.modrinth.com 的替换规则与示例。
order: 1
---

## 替换规则

| 原始 | 镜像 |
| --- | --- |
| `https://api.modrinth.com/v2/...` | `https://mod.mcimirror.top/modrinth/v2/...` |
| `https://cdn.modrinth.com/...` | `https://mod.mcimirror.top/...` |

## 示例

项目信息：

```
https://api.modrinth.com/v2/project/sodium
https://mod.mcimirror.top/modrinth/v2/project/sodium
```

版本列表：

```
https://api.modrinth.com/v2/project/sodium/version
https://mod.mcimirror.top/modrinth/v2/project/sodium/version
```

文件下载，镜像返回 302 跳到 CDN：

```
https://cdn.modrinth.com/data/<project_id>/versions/<version_id>/<file>
https://mod.mcimirror.top/data/<project_id>/versions/<version_id>/<file>
```

## 限制

- 搜索接口透传上游并缓存一小时，结果与官方可能有短暂差异。
- 未收录的项目第一次请求会得到 404，同时进入补抓队列，稍后再试。
- 响应里的 `sync_at` 是该条目的缓存日期，见 [缓存日期](/guide/semantics/freshness)。
