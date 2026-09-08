---
title: CurseForge
description: api.curseforge.com 与文件 CDN 的替换规则，以及 mediafilez 的注意事项。
order: 2
---

## 替换规则

| 原始 | 镜像 |
| --- | --- |
| `https://api.curseforge.com/v1/...` | `https://mod.mcimirror.top/curseforge/v1/...` |
| `https://edge.forgecdn.net/...` | `https://mod.mcimirror.top/...` |

请求镜像不需要 CurseForge API Key。

## 示例

```
https://api.curseforge.com/v1/mods/238222
https://mod.mcimirror.top/curseforge/v1/mods/238222
```

```
https://api.curseforge.com/v1/mods/238222/files
https://mod.mcimirror.top/curseforge/v1/mods/238222/files
```

文件下载，镜像返回 302 跳到 CDN：

```
https://edge.forgecdn.net/files/<id1>/<id2>/<file>
https://mod.mcimirror.top/files/<id1>/<id2>/<file>
```

## 注意

- **不要**把 `mediafilez.forgecdn.net` 替换成 `mod.mcimirror.top`。
- 只提供 Minecraft 的内容，不支持 CurseForge 上的其他游戏。
- 指纹匹配接口可用，未命中的指纹会进入补抓队列。
