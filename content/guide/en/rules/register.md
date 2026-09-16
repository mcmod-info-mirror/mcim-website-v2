---
title: Registration
description: Register your launcher name and User-Agent before you integrate.
order: 1
---

The mirror may start enforcing a User-Agent allowlist. Before integrating, leave a comment on [launcher registry](https://github.com/mcmod-info-mirror/mcim-rust-api/issues/12) with your launcher name and the User-Agent you send.

## User-Agent format

`Name/Version` is preferred, for example:

```
HMCL/3.6.0
ColorMC/1.0.0
SJMCL/0.1.0
```

Keep the name fixed and move the version with your releases. Always send this UA to the mirror; do not send an empty UA or the default UA of your HTTP library.

## Other expectations

- Do not build a wrapper service on top of the mirror; see [Policy](/guide/rules/policy).
- Keep concurrency and retries reasonable, and do not load-test the mirror.
