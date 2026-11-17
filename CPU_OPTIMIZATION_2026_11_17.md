# CPU optimisation — 17 November 2026

The public homepage was the largest function CPU consumer in the recent Vercel
12-hour view (95 invocations, 36 seconds CPU). Its new editorial news query used
a five-minute cache and therefore limited the full route to that interval.
Use a one-hour cache for this query and the route. Authorised news saves already
invalidate the saeac-public tag and homepage layout, so publication need not wait
an hour. Competition results, live displays, portal access and scoring are unchanged.

Validation: production webpack build and existing public-filter tests.
Confirm the deployed homepage returns a CDN HIT on repeated GET requests.
Savings must be measured after rollout; this does not reset prior team usage.
