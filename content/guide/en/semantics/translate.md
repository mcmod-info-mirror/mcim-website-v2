---
title: Summary translations
description: Chinese translations of Modrinth project and CurseForge mod summaries.
order: 2
---

The source text comes from the `description` field of a Modrinth project and the `summary` field of a CurseForge mod. The translations are produced by [translate-mod-summary](https://github.com/mcmod-info-mirror/translate-mod-summary).

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

Both endpoints also accept POST. The batch endpoints and their parameters are in the Translate group of the [API reference](/docs).
