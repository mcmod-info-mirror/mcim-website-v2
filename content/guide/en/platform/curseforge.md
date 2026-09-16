---
title: CurseForge
description: Replacement rules for api.curseforge.com and the file CDN, plus the mediafilez caveat.
order: 2
---

## Replacement rules

| Upstream | Mirror |
| --- | --- |
| `https://api.curseforge.com/v1/...` | `https://mod.mcimirror.top/curseforge/v1/...` |
| `https://edge.forgecdn.net/...` | `https://mod.mcimirror.top/...` |

The mirror does not require a CurseForge API key.

## Examples

```
https://api.curseforge.com/v1/mods/238222
https://mod.mcimirror.top/curseforge/v1/mods/238222
```

```
https://api.curseforge.com/v1/mods/238222/files
https://mod.mcimirror.top/curseforge/v1/mods/238222/files
```

File downloads, where the mirror answers with a 302 to the CDN:

```
https://edge.forgecdn.net/files/<id1>/<id2>/<file>
https://mod.mcimirror.top/files/<id1>/<id2>/<file>
```

## Caveats

- Do **not** replace `mediafilez.forgecdn.net` with `mod.mcimirror.top`.
- Only Minecraft content is mirrored; other games on CurseForge are not supported.
- The fingerprint endpoints work; fingerprints that miss enter the fetch queue.
