# How I troubleshot three API failures without guessing

I built a small order dashboard with a local REST API, then treated its failures like a real support incident.

The first symptom was simple: the dashboard could not load any orders.

Instead of changing code immediately, I followed an evidence-first workflow:

1. Reproduce the issue consistently.
2. Inspect the browser request in Chrome DevTools.
3. Test the same endpoint independently in Postman.
4. Compare the API response with what the frontend expects.
5. Check request timing and server logs.
6. Apply one fix and verify the result before moving on.

That process uncovered three different root causes:

- A route mismatch produced a 404 response.
- A response returned 200 but used the wrong JSON property, so the UI still failed.
- A deliberate server delay made a correct response feel broken.

The biggest lesson was that an HTTP 200 only proves the request succeeded at the transport level. It does not prove the response matches the application's contract or meets its performance expectations.

Tools used: Chrome DevTools, Postman, Node.js, and Visual Studio Code.

My troubleshooting rule from now on: collect evidence, isolate the layer, change one thing, and verify.

