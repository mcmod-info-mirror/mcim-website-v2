---
title: 快速开始
description: ''
order: 1
---

MCIM 为中国大陆用户镜像 Modrinth 与 CurseForge 的 Mod 信息与文件。接口的路径、参数与响应结构与官方一致，只需替换域名。

不熟悉官方接口的话，先看 [CFCore 文档](https://docs.curseforge.com) 与 [Modrinth 文档](https://docs.modrinth.com)。

## URL 替换总表

| 原始 | 镜像 |
| --- | --- |
| `api.modrinth.com` | `mod.mcimirror.top/modrinth` |
| `cdn.modrinth.com` | `mod.mcimirror.top` |
| `api.curseforge.com` | `mod.mcimirror.top/curseforge` |
| `edge.forgecdn.net` | `mod.mcimirror.top` |

`mediafilez.forgecdn.net` 不要替换，见 [CurseForge](/guide/platform/curseforge)。

## 接入前

1. 到 [启动器信息登记](https://github.com/mcmod-info-mirror/mcim-rust-api/issues/12) 留下启动器名与 User-Agent，见 [接入登记](/guide/rules/register)。
2. 读一遍 [缓存日期](/guide/semantics/freshness)，决定怎样对待缓存响应。
3. 全部接口见 [接口参考](/docs)。
