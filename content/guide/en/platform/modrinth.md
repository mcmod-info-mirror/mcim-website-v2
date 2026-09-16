---
title: Modrinth
description: Replacement rules and examples for api.modrinth.com and cdn.modrinth.com.
order: 1
---

## Replacement rules

| Upstream | Mirror |
| --- | --- |
| `https://api.modrinth.com/v2/...` | `https://mod.mcimirror.top/modrinth/v2/...` |
| `https://cdn.modrinth.com/...` | `https://mod.mcimirror.top/...` |

## Examples

Project information:

```
https://api.modrinth.com/v2/project/sodium
https://mod.mcimirror.top/modrinth/v2/project/sodium
```

Version list:

```
https://api.modrinth.com/v2/project/sodium/version
https://mod.mcimirror.top/modrinth/v2/project/sodium/version
```

File downloads, where the mirror answers with a 302 to the CDN:

```
https://cdn.modrinth.com/data/<project_id>/versions/<version_id>/<file>
https://mod.mcimirror.top/data/<project_id>/versions/<version_id>/<file>
```

## Limits

- The search endpoint passes through to upstream and caches for an hour, so results can differ from the official ones for a short while.
- A project that has not been cached yet returns 404 on the first request and enters the fetch queue; try again shortly.
- The `sync_at` field in a response is that entry's cache date; see [Cache dates](/guide/semantics/freshness).
