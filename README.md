# API Incident Lab: Fixing a Broken REST API

An evidence-first troubleshooting project that reproduces and resolves a realistic REST API incident — a broken order dashboard — using Chrome DevTools, Postman, and server logs to diagnose root causes before writing a single line of fix code.

## Overview

A local order dashboard was failing to load. Rather than guessing at a fix, this project follows a disciplined incident-response workflow: reproduce the failure, gather evidence from multiple independent sources (browser, API client, server logs), form an evidence-based hypothesis, apply a targeted fix, and verify the result. The process was repeated across four distinct issues, each layered on top of the last.

## Toolkit

- **Google Chrome + DevTools** — inspecting network requests, response bodies, initiators, and timing
- **Postman** — testing API endpoints independently of the browser to isolate frontend vs. backend issues
- **Visual Studio Code** — reviewing and editing the Node.js server and dashboard code
- **Node.js** — running the local REST API and server
- **Windows PowerShell** — running commands and environment readiness checks

Each tool was verified independently before the investigation began, to rule out environment/setup issues from muddying the diagnosis.

## Incidents Investigated

### 1. Route Mismatch (HTTP 404)
**Symptom:** Dashboard showed `Unable to load orders: HTTP 404`.
**Evidence:** Server logs confirmed the request reached the server; DevTools Network panel showed the dashboard was calling `GET /api/order` (singular), which returned `{"error":"Route not found"}`. Postman confirmed `/api/orders` (plural) returned HTTP 200 with valid data.
**Root cause:** The frontend `fetch()` call in `public/index.html` was pointed at the wrong endpoint.
**Fix:** Corrected the frontend request to use `/api/orders`.

### 2. Response Contract Mismatch
**Symptom:** API returned HTTP 200, but the dashboard still failed to render any orders.
**Evidence:** The response body nested order records under an `items` property, while the frontend code expected `data.orders`.
**Root cause:** A mismatch between the API's response shape and the contract the frontend was coded against.
**Fix:** Updated the server response to return orders under the `orders` property the frontend already expected, rather than changing frontend code.

### 3. Backend Latency
**Symptom:** Dashboard loaded correctly but felt sluggish.
**Evidence:** DevTools Timing panel showed the delay was almost entirely Waiting (TTFB), not download or render time. Postman reproduced the same ~2-second delay when hitting the API directly, isolating the cause to the backend.
**Root cause:** An artificial delay/timeout built into the server route.
**Fix:** Removed the artificial delay while preserving the corrected response contract and all three order records.

### 4. Safe Error Handling (HTTP 500)
**Goal:** Introduce a controlled server error and confirm it fails safely.
**Evidence:** Postman showed the client-facing response returned only a generic error message with no internal database or timeout details exposed. The server terminal log retained the full, specific failure cause.
**Result:** Confirmed a proper separation between client-safe error messaging and the detailed diagnostics needed by support/engineering.

## Workflow Summary

Every issue followed the same evidence chain:

```
Symptom → Evidence (browser + API client + logs) → Root-cause hypothesis → Targeted fix → Verification
```

This structure avoided speculative fixes and made each conclusion traceable back to a specific piece of proof (a status code, a response body, a timing breakdown, or a log entry).

## Outcome

- All three orders load quickly and correctly on the dashboard
- The 404 routing error, response contract mismatch, and artificial latency were all resolved
- A simulated HTTP 500 confirmed the app fails safely: generic message to the user, full detail preserved in server logs for support

**Time to complete:** ~58 minutes, including setup, investigation, fixes, verification, and documentation.

## Author

**Fuad Aye (SZN)**
September 2026
