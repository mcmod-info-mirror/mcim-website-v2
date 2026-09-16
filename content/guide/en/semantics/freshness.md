---
title: Cache dates
description: What sync_at and checked_at mean, and how a launcher should treat a cached response.
order: 1
---

MCIM serves a cache, not a live passthrough. Every cached response carries the cache date of the entry it came from.

## sync_at

`sync_at` is the last time the entry was actually pulled from upstream and written to the cache, formatted as `YYYY-MM-DDTHH:MM:SSZ`. One response can carry several `sync_at` values for its different parts, for instance the project itself and its version list.

## checked_at

`checked_at` is the last time the entry was compared against upstream and confirmed unchanged. Every refresh run stamps `checked_at` on the entries it checked, whether or not anything changed; `sync_at` only moves when something was really re-fetched. The gap between the two means "confirmed still current, but nothing changed".

## What a launcher should do

Risk-control changes upstream can leave MCIM unable to refresh its cache in time. Check the cache date yourself and decide whether to trust the response. When freshness matters, such as for a version released moments ago, query the official API directly to confirm.

## What happens on a miss

Requesting an id, slug, file hash or fingerprint that is not in the cache returns 404 and puts it into the fetch queue, where the sync program picks it up from upstream shortly after. Retrying a little later usually hits. You can watch the crawl tasks on the [sync status](/status) page, and check a single entry with the [lookup](/lookup) tool.
