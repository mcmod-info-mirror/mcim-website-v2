---
title: Files and icons
description: File and icon downloads are 302 redirects, and what that means for reliability.
order: 3
---

The mirror does not serve file bytes itself. Requests on the `cdn.modrinth.com` and `edge.forgecdn.net` paths answer with a 302 to the file mirror Pysio provides. Your client has to follow redirects.

Project icons and author avatars are 302 redirects as well.

## Reliability

File downloads are not guaranteed to be stable. Prefer trying the official source first and falling back to the mirror when that fails, rather than going through the mirror by default.

## Revenue

API downloads do not count towards mod author revenue. Downloading from the official source or from the mirror makes no difference to the author's earnings.
