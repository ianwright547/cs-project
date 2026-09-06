# Architectural constraints

Paste this at the top of every AI build session, along with the relevant part of the system design.

---

This product is free with no revenue. **Server cost must not scale with the number of users.**

## Hard rules

- **No AI in the product.** No API calls to any model, ever. All hints and review comments are written in advance.
- **No user-submitted code executes on the server.** It runs in the browser, in a Web Worker.
- **No server endpoint proxies a request to GitHub on a user's behalf.** The browser calls GitHub directly with the user's own token.
- **Course content is loaded from files into memory at startup.** Never stored in or read from the database per request.
- **No background workers, job queues, cron jobs, or long-lived connections.** No WebSockets, no SSE.
- **No server-side polling of any external service.**
- **No caching layer.** No Redis, no Memcached. If something needs caching, it belongs in the process or in the client.
- **Every database query is scoped to the authenticated user.** No endpoint accepts a user id from the client.
- **Secrets come from environment variables, never from code.**
- Every API request should complete in well under 50ms of server time and touch only a handful of small rows.

## When a request conflicts with these

Say so and propose a client-side alternative. Do not silently add server work.

## After finishing a piece

Report three things:
1. What you built
2. What you assumed
3. Anything in the design that turned out to be wrong

That third one matters most — it surfaces gaps while they're still cheap to fix.
