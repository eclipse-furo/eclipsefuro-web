# @furo/route

URL-driven routing for Lit-based SPAs. Every view is derived from the URL, ensuring proper deep link handling and shareable URLs.

## Core Concepts

### URL-First Principle
The URL is the single source of truth. Navigation events update the URL, and all components react to URL changes — never to the events directly. This guarantees that any view can be reconstructed from its URL.

### Page Requests
Named requests (e.g., `"person-requested"`, `"home-requested"`) that describe navigation intent. The `-requested` suffix is intentional: at dispatch time the page hasn't been shown yet — the caller signals what was *requested*, and the router decides what to do. Using a name like `"cube-shown"` would be premature since nothing has rendered yet. Emitted via `FuroAppFlow.emit()`, they are resolved by `FuroAppFlowRouter` into URL updates.

### View Requests
A `ViewRequest` maps a page request to a target path, with optional query param mapping and external link handling. Defined in a `RouteMap` (a plain object keyed by request name).

### Waypoints
History entries managed by `FuroWaypoint`. A waypoint stages a history push that commits when the next URL replacement occurs, enabling proper back-button behavior.

## How It All Works Together

Imagine a user clicking a card on your overview page. The page doesn't navigate directly — it simply emits a named request, something like `"person-requested"`. That request bubbles up to the router, which looks up the matching route configuration, translates it into a URL, and pushes that URL into the browser's address bar. From there, a location parser picks up the change, figures out which path, query params, and hash params are present, and notifies the page container. The container then activates the right child page and calls its lifecycle hooks so it can fetch data and render.

Because the URL is always the single source of truth, every view in your app is a deep link by default. Users can bookmark a page, share the link with a colleague, or paste it into a chat — and the recipient lands on exactly the same view. There's no hidden state that only lives in memory.

Pages stay blissfully unaware of each other. A page that wants to show person details doesn't import or reference the person page; it just emits a request name. The route configuration is the only place that knows which name maps to which URL. This makes it easy to reorganise your app, swap pages, or add redirects without touching the pages themselves.

Back-button support comes almost for free through waypoints. Before dispatching a navigation, a page tells its waypoint to stage a history entry. When the router commits the next URL change, that staged entry is pushed onto the browser's history stack. Pressing the back button pops the entry and restores the previous URL — no manual bookkeeping required. On top of that, a navigation lock can intercept any pending navigation and show a confirmation dialog, protecting users from accidentally leaving a form with unsaved changes.

Finally, tabs and URLs stay in lockstep through a small controller that reads the active tab from a query param and writes it back when the user switches tabs. The result is that tab state survives page reloads and can be shared via URL, all without any manual wiring between the tab component and the address bar.

### Host-Based / Path-Based Environments

When the app owns the entire host — say `app.lives.here.com` — there is nothing to configure. `APP_ROOT` stays empty, `urlSpaceRegex` stays empty, and every path on that host belongs to the app. This is the default and the most common setup.

For path-based deployments where the app lives under a subdirectory — for example `some.domain.com/app/lives_here` — you need to touch a handful of config points:

1. In `index.html`, set `window.APP_ROOT` to the subdirectory path (e.g. `"/app/lives_here"`).
2. In the same file, update the `<base href>` to match (e.g. `<base href="/app/lives_here/" />`).
3. When creating the `FuroAppFlowRouter` (typically in `AppShell.ts`), pass `` `^${window.APP_ROOT}` `` as the second argument so the router knows which URL prefix belongs to the app.
4. Pass the same `` `^${window.APP_ROOT}` `` pattern to `FuroLocation` (typically in `MainStage.ts`) so the location parser strips the prefix before handing paths to pages.
5. If the exact deploy path isn't known at build time, check the commented-out snippet in `index.html` — it shows a dynamic detection pattern that derives `APP_ROOT` from the current URL at runtime.

The router strips the prefix for internal routing and re-adds it when building URLs, so page components never see the prefix and work identically in both modes.

Click interception respects this boundary automatically. `FuroAppFlowRouter` only intercepts `<a>` clicks whose pathname matches `urlSpaceRegex`, so other apps or pages on the same host are left alone. `FuroLocation` similarly ignores URL changes that fall outside the regex, meaning multiple independent SPAs can coexist on a single origin without interfering with each other.

`APP_ID` (defined in `Vars.ts`) scopes the i18n bundle registration so that multiple apps on the same origin don't clash when they share the same message keys. For full PWA isolation the manifest `id` and `start_url` should also reflect the app's base path.

When `urlSpaceRegex` is set, `FuroLocation` fires a `url-space-entered` event whenever the user lands on the bare app root — that is, the path matches the regex with no further segments, query, or hash. This is handy for redirecting to a default page on first entry without hard-coding a path into the router configuration.

## Components & Classes

### FuroAppFlowRouter

The central router. Updates the URL and manages browser history state.

**Setup:**
```typescript
import { FuroAppFlowRouter } from "@furo/route";

new FuroAppFlowRouter(RouteConfig, "^/app/");
```

**Constructor:**
- `config: RouteMap` — Route configuration mapping request names to view requests
- `urlSpaceRegex?: string` — RegExp pattern defining which URLs belong to this app

**Config format (`RouteMap`):**
```typescript
const RouteConfig = {
  "person-requested": {
    target: "person",
    queryParamMapping: "*",
    description: "Person details",
  },
  unauthorized: {
    target: "auth.html",
    isExternalTarget: true,
    queryParamMapping: "*",
  },
} as const satisfies Record<string, ViewRequest>;
```

**`ViewRequest` fields:**
| Field | Type | Description |
|-------|------|-------------|
| `target` | `string` | Target URL path segment |
| `queryParamMapping` | `null \| "*" \| QueryParamMap[]` | How to map page request query params to URL params. `"*"` passes all through. |
| `description` | `string` | Human-readable route description |
| `isExternalTarget` | `boolean` | Navigate away from the SPA |
| `forceOpenBlank` | `boolean` | Always open in a new window |
| `pageOverrides` | `Record<string, Partial<ViewRequest>>` | Override target/mapping based on the current page |

**`pageOverrides` example:**
```typescript
"details-requested": {
  target: "details",
  queryParamMapping: "*",
  pageOverrides: {
    "overview": { target: "overview/details" },
  },
}
```
When on the `overview` page, `details-requested` navigates to `overview/details` instead of `details`.

**Built-in system events** (no config entry needed):
| Event | Behavior |
|-------|----------|
| `history-back` | Navigate back. Fires `__beforeHistoryBack` (cancellable by `FuroNavigationLock`). Falls back to `HISTORY-BACK-FALLBACK` if at history start. |
| `EXTERNAL_LINK` | Open `pageRequest.queryParams.url` externally. Respects modifier keys for new-window. |
| `HISTORY-BACK-FALLBACK` | Calls `window.close()`. Used when back is triggered in a window with no history. |

**Key methods:**
- `trigger(pageRequest: PageRequest): boolean` — Main routing method
- `back()` — Navigate back (with fallback)
- `forward()` — Navigate forward

**Click interception:** Intercepts clicks on `<a>` tags within the URL space. Internal links update history state without a full page reload. External links and modifier-clicks pass through.

### FuroAppFlow

Static API for emitting page requests from application code.

```typescript
import { FuroAppFlow } from "@furo/route";

// Navigate to a page
FuroAppFlow.emit("person-requested", { id: "42" });

// Open an external link
FuroAppFlow.openExternalLink("https://example.com");
```

### FuroPages

A Lit component that switches between child pages based on the URL.

```html
<furo-pages default="home">
  <page-home name="home"></page-home>
  <page-details name="details"></page-details>
  <page-404 name="404"></page-404>
</furo-pages>
```

**Properties:**
- `default` (attribute) — Default page name if no URL match
- `mode` — `"default"` (hide/show via `aria-hidden`) or `"destructive"` (remove/re-insert from DOM)

**Page lifecycle hooks** (implement `FuroPage` interface on child components):

| Method | When called |
|--------|-------------|
| `onPageActivated(location)` | Page becomes active (first time or returning from another page) |
| `onPageDeactivated(newLocation)` | Page loses focus |
| `onPageUpdated(location)` | URL changes while page is already active |
| `onPageQueryChanged(location)` | Only query params changed (optional) |
| `onPageHashChanged(location)` | Only hash params changed (optional) |

**Required CSS on pages:**
```css
:host([aria-hidden]) { display: none; }
```

### FuroLocation

Parses the URL and dispatches change events.

```typescript
const location = new FuroLocation("^/app/");
location.addEventListener("location-changed", (e) => {
  console.log(e.detail); // LocationObject
});
```

**Events dispatched:**
- `location-changed` — Any URL component changed
- `location-path-changed` — Path changed
- `location-query-changed` — Query params changed
- `location-hash-changed` — Hash params changed
- `url-space-entered` — Entered the URL space

**`LocationObject`:**
```typescript
{
  host: string;
  path: string;
  pathSegments: string[];
  query: Record<string, string | number>;
  queryString: string;
  hash: Record<string, string | number>;
  hashString: string;
}
```

### FuroLocationUpdater

Static utility for updating URL query and hash params without triggering a full navigation.

```typescript
import { FuroLocationUpdater } from "@furo/route";

// Add/update query params
FuroLocationUpdater.updateQueryParams({ tab: "overview", page: 1 });

// Remove specific query params
FuroLocationUpdater.updateQueryParams({}, "tab,page");

// Update hash params
FuroLocationUpdater.updateHashParams({ section: "top" });
```

Both methods fire `__beforeReplaceState` (cancellable) and `__furoLocationChanged`.

### FuroWaypoint

Manages browser history entries and document titles.

```typescript
const waypoint = new FuroWaypoint("Person Details", "App - ", "");
waypoint.activate();        // Sets document title
waypoint.setWaypoint();     // Stages a history push

// Or use the static method after a flow event:
FuroWaypoint.deepDive();    // Commits the currently activated waypoint
```

**Document title** is composed as: `prefix + documentTitle + suffix`.

**Staging mechanism:** `setWaypoint()` puts the waypoint in a pre-stage. It commits (pushes to history) when the next `__beforeReplaceState` fires, or cancels if a `popstate` occurs first.

### History & Back Navigation

Understanding what creates a back-navigation point:

- **`activate()`** sets the document title and registers the waypoint as the "current" one, but does **not** push to history yet.
- **`setWaypoint()`** stages a history push. It commits (calls `history.pushState`) when the next `__beforeReplaceState` fires (i.e., on the next navigation). If a `popstate` occurs first, the staged waypoint is cancelled.
- **`deepDive()`** is the static shortcut: it calls `setWaypoint()` on whichever waypoint was last `activate()`-d. Call this before `dispatchPageRequest()` / `FuroAppFlow.emit()` in click handlers so the current page becomes a history entry the user can return to with the back button.

**Rule of thumb:** Every user-initiated navigation (card click, row click, link) should call `FuroWaypoint.deepDive()` before dispatching. System-driven navigations (error redirects) may also use it. The `history-back` event itself does **not** need it.

### FuroNavigationLock

Prevents navigation when there are unsaved changes.

```typescript
const lock = new FuroNavigationLock("Discard unsaved changes?");
lock.lock();    // Block navigation with confirmation dialog
lock.unlock();  // Allow navigation again
```

Intercepts `__beforeReplaceState`, `__beforeHistoryBack`, and `beforeunload`. Shows `window.confirm()` — if the user confirms, the lock auto-unlocks.

### TabController

A Lit `ReactiveController` that syncs tabs with URL query params.

```typescript
class MyPage extends LitElement {
  private tabs = new TabController(this, {
    urlParam: "tab",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "details", label: "Details" },
    ],
    defaultTab: "overview",
    tabContainerSelector: "#my-tabs",
  });

  onPageActivated(location: LocationObject) {
    this.tabs.syncFromUrl(location);
  }

  onPageUpdated(location: LocationObject) {
    this.tabs.syncFromUrl(location);
  }

  render() {
    return html`
      <lgt-tabcontainer id="my-tabs" @tab-select="${this.tabs.handleTabSelect}">
        ${this.tabs.tabs.map(t => html`<lgt-tab id="${t.id}">${t.label}</lgt-tab>`)}
      </lgt-tabcontainer>
      <furo-pages default="${this.tabs.defaultTab}">
        <tab-overview name="overview"></tab-overview>
        <tab-details name="details"></tab-details>
      </furo-pages>
    `;
  }
}
```

**Flow:** tab click → `selectTab()` → URL update → `onPageUpdated()` → `syncFromUrl()` → re-render.

## Configuration Example

```typescript
import type { ViewRequest } from "@furo/route";

const RouteConfig = {
  // Error handling
  unauthorized: {
    target: "auth.html",
    isExternalTarget: true,
    queryParamMapping: "*",
    description: "Auth page behind gateway",
  },
  "object-not-found": {
    target: "404",
    queryParamMapping: "*",
  },

  // Navigation
  "home-requested": {
    target: "",
    queryParamMapping: "*",
  },

  // View requests
  "person-requested": {
    target: "person",
    queryParamMapping: "*",
    description: "Person details",
  },
} as const satisfies Record<string, ViewRequest>;

export type PageRequestName =
  | keyof typeof RouteConfig
  | "history-back"
  | "EXTERNAL_LINK";
```

## Event Flow

There are three distinct entry points that all converge at the shared
`__beforeReplaceState` → `__furoLocationChanged` pipeline.

The `FuroLocation` → `FuroPages` pipeline is independent of how the URL change
originated. A minimal setup without `FuroAppFlowRouter` still works for
programmatic navigation via `FuroLocationUpdater`, but `<a>` click interception
requires `FuroAppFlowRouter`.

```
── Entry Points ──────────────────────────────────────────────

1) <a href="…"> click (handled by FuroAppFlowRouter.clickHandler)
   │  Filters: same host, no _blank, no modifier keys, urlSpaceRegex
   │
   ▼

2) FuroAppFlow.emit(requestName, queryParams)
   │
   ▼
   FuroAppFlowRouter.trigger(pageRequest)
   │  Resolves RouteConfig → target + queryParamMapping
   │  Handles built-ins: history-back, EXTERNAL_LINK
   │
   ▼

3) FuroLocationUpdater.updateQueryParams() / .updateHashParams()
   │  Works without FuroAppFlowRouter
   │
   ▼

── Shared Pipeline ───────────────────────────────────────────

__beforeReplaceState ←── FuroNavigationLock may cancel
         │
         ▼
window.history.replaceState() ←── FuroWaypoint commits staged push
         │
         ▼
__furoLocationChanged (internal)
         │
         ▼
FuroLocation parses URL
         │
         ├─ location-path-changed
         ├─ location-query-changed
         ├─ location-hash-changed
         └─ location-changed
                │
                ▼
FuroPages.injectLocation()
         │
         ├─ onPageActivated() / onPageDeactivated()
         ├─ onPageUpdated()
         ├─ onPageQueryChanged()
         └─ onPageHashChanged()
                │
                ▼
TabController.syncFromUrl() → host.requestUpdate() → render()


── Browser-level Navigation (separate path) ──────────────────

Page reload, tab close, external URL entered in address bar
         │
         ▼
beforeunload event ←── FuroNavigationLock._unloadHandler
         │               calls event.preventDefault()
         │               → browser shows native "Leave site?" dialog
         │
         ▼
This path does NOT go through __beforeReplaceState or FuroLocation.
The browser handles it entirely — FuroNavigationLock only triggers
the native confirmation dialog via the beforeunload API.
```
