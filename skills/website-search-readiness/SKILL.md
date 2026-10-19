---
name: website-search-readiness
description: Use for a bounded public-page SEO and answer-readiness review before proposing website changes; not a ranking forecast or security scan.
license: CC-BY-4.0
---

# Website Search Readiness

Review a user-selected public homepage and a small representative set of pages. This is a triage workflow, not a guarantee of indexing, rankings, traffic, AI inclusion or conversion. Do not crawl private pages or submit changes to search platforms automatically.

## Reusable prompt

Define the intended audience, primary offer, canonical domain and exact public pages in scope. Record UTC timestamps, URLs, HTTP status, redirect chain, response headers, source HTML and rendered observations. Redact credentials, private links, personal data and query-string secrets before preserving artifacts. Work from current primary evidence, not a cached search snippet or a guessed sitemap.

Check whether each intended public page returns usable content, whether its canonical target agrees with its final URL, and whether explicit noindex directives appear in HTML or X-Robots-Tag. Read the site's robots.txt and advertised sitemap when present; distinguish crawler directives from indexing directives. Do not infer that a missing sitemap blocks indexing, that a robots.txt rule proves deindexing, or that a canonical hint guarantees selection. Ask for authorized Search Console evidence before claiming actual index status.

Compare the HTML source and rendered page. Check that the title, primary heading and visible main content identify the real product, audience and next action. Identify questions the page actually answers, whether material statements cite verifiable evidence, and whether service scope, pricing basis and contact or purchase routes are understandable. Mark absent business facts as questions; never invent customers, endorsements, guarantees or testimonials.

If structured data exists, parse it and compare its entities and claims with visible content. Record malformed data separately from supported-but-inapplicable or unverifiable eligibility. Consult current official search documentation before recommending a schema type or asserting eligibility. Do not add fabricated reviews, FAQ answers, ratings or organization details.

Re-read every suspected blocking directive or redirect in two fresh requests and cross-check using a second method such as a browser or an authorized search inspection tool. Review contradictions: deliberate staging restrictions, language variants, JavaScript rendering, headers overriding expectations, stale caches and a different canonical domain. Label inconsistent results unverified. An accessible page is not proof of indexing or AI citations.

Prepare a short priority list: confirmed access/index-directive problems first, inconsistent identity/canonical signals next, then unsupported claims or answer gaps. Separate confirmed observations, conditional recommendations and owner questions. Performance, accessibility and conversion claims require their own measured checks; do not infer them from this review. Do not publish an accusation or modify the site without authorization.

## Review template

- Exact page / intended canonical / UTC:
- Status, redirects, crawl and index directives:
- Source versus rendered title, heading and main content:
- Answer gaps and facts requiring owner confirmation:
- Structured-data parse result and visible consistency:
- Attempt A / B / second method / contradictions:
- Disposition: verified observation / unverified / not tested:
- Priority, narrow recommendation and validation after change:

## Acceptance checklist

Every observation links to an artifact and tested URL. Index status is left unknown without authorized primary evidence. Recommendations do not promise rankings or AI exposure and distinguish technical access from content usefulness. No credentials, fabricated business claims or private pages enter the report.

Source: KnownFix evidence-first workflow. SEO, AEO and GEO outcomes remain unmeasured until separately evaluated.

## Synthetic example

Read [examples and acceptance criteria](references/examples.md) when practicing or validating this workflow. These fixtures are not customer evidence.
