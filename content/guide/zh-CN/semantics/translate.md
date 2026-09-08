---
title: 简介翻译
description: Modrinth 项目与 CurseForge Mod 简介的中文翻译接口。
order: 2
---

简介原文来自 Modrinth Project 的 `description` 与 CurseForge Mod 的 `summary`，翻译由 [translate-mod-summary](https://github.com/mcmod-info-mirror/translate-mod-summary) 生成。

## Modrinth

```
GET https://mod.mcimirror.top/translate/modrinth?project_id=P7dR8mSH
```

```json
{
  "project_id": "P7dR8mSH",
  "translated": "轻量级且模块化的API，为使用Fabric工具链的模组提供了常见的钩子功能和互操作性措施。",
  "original": "Lightweight and modular API providing common hooks and intercompatibility measures utilized by mods using the Fabric toolchain.",
  "translated_at": "2025-02-02T08:53:28.638000"
}
```

## CurseForge

```
GET https://mod.mcimirror.top/translate/curseforge?modId=238222
```

```json
{
  "modid": 238222,
  "translated": "查看物品和配方",
  "original": "View Items and Recipes",
  "translated_at": "2025-02-02T10:01:52.805000"
}
```

两个接口同时接受 POST。批量接口与参数见 [接口参考](/docs) 的 Translate 分组。
