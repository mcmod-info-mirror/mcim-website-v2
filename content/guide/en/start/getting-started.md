---
title: Getting started
description: ''
order: 1
---

MCIM mirrors Modrinth and CurseForge mod metadata and files for users in mainland China. Paths, parameters and response shapes match the upstream APIs, so only the domain changes.

If you are new to the upstream APIs, read the [CFCore docs](https://docs.curseforge.com) and the [Modrinth docs](https://docs.modrinth.com) first.

## Replacement table

| Upstream | Mirror |
| --- | --- |
| `api.modrinth.com` | `mod.mcimirror.top/modrinth` |
| `cdn.modrinth.com` | `mod.mcimirror.top` |
| `api.curseforge.com` | `mod.mcimirror.top/curseforge` |
| `edge.forgecdn.net` | `mod.mcimirror.top` |

Do not replace `mediafilez.forgecdn.net`; see [CurseForge](/guide/platform/curseforge).

## Before you integrate

1. Register your launcher name and User-Agent in the [launcher registry](https://github.com/mcmod-info-mirror/mcim-rust-api/issues/12); see [Registration](/guide/rules/register).
2. Read [Cache dates](/guide/semantics/freshness) and decide how to treat cached responses.
3. Every endpoint is listed in the [API reference](/docs).
