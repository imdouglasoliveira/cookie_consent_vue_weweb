# PRD-2: Cookie Consent Component Updates — Consent, IDs & Integrations

**Version:** 2.0
**Date:** 2024-12-16
**Status:** Draft
**Author:** Development Team

---

## 1. Overview

### 1.1 Purpose
Evolve the Cookie Consent component to a **compliance-first opt-in mode** with optional integrations and predictable behavior across subdomains.

### 1.2 Current State
The component already:
- Saves consent in `localStorage` (`cookieConsent`) with cookie fallback
- Fires events (`consentGiven`, `preferencesUpdated`, etc.) and exposes public actions (workflows)
- Implements **script gating** with `data-cc-category` + `type="text/plain"` and activates via `enableScripts()`
- Generates `consentId` with `Date.now()` + `Math.random()`

### 1.3 Challenges
Missing guarantees and standardizations for:
- Synchronization between subdomains/sessions
- Complete Consent Mode v2 (default denied + update)
- More robust consentId generation
- More consistent public API (actions/events/config)
- Explicit configuration to **notify** GA/Meta Pixel when consent changes
- Initial state as "denied/absent" until user chooses

### 1.4 Target Users
- **Visitors**: "I want to browse without being tracked before accepting."
- **Admin/Dev**: "I want to control GA/Pixel by config without touching multiple site points."
- **Compliance**: "I need to prove that the default was denied and only enabled after user action."

---

## 2. Objectives

| ID | Objective | Success Metric |
|----|-----------|----------------|
| O-01 | Implement compliance-first initial state | Default denied verified in first visit |
| O-02 | Full Google Consent Mode v2 support | All 4 signals (analytics_storage, ad_storage, ad_user_data, ad_personalization) |
| O-03 | Cross-subdomain consent sync | Consent recognized on sub.domain.com |
| O-04 | Robust consent ID generation | UUID v4 format with fallback |
| O-05 | Consistent public API | Standardized action/event names |

---

## 3. Scope

### 3.1 In Scope
1. Synchronize consent between **subdomains** and improve session persistence
2. Implement **complete Google Consent Mode v2**
3. Improve `consentId` generation (UUID)
4. Make public API more consistent (names, payload, actions)
5. Config to control:
   - Whether to notify GA (Consent Mode update)
   - Whether to notify Meta Pixel (consent grant/revoke)
   - Whether to apply "default denied" at startup
6. Define initial state as **denied/absent** (until user click)

### 3.2 Out of Scope (PRD-2)
- IAB TCF 2.0 vendors / TC string (may become PRD-3)
- Automatic cookie scanner
- Mandatory backend (optional via triggers continues)

---

## 4. Assumptions

- The component will continue to be used within **WeWeb** (workflows + triggers)
- Third-party scripts can be "gated" in HTML via `type="text/plain"` and `data-cc-category`
- For Consent Mode v2, we will follow the logic: **"default denied" as early as possible** and "update" when the user chooses

---

## 5. Functional Requirements

### Epic A — Initial State "denied/absent"

#### A1. Default State
**Priority:** Critical

- When no consent is stored, internal state must be "noConsent"
- In `opt-in` mode, **do not activate** analytics/marketing/personalization
- Banner must appear (as it already does) when there's no consent and it's not "informational"

**Acceptance Criteria:**
- [ ] State is "noConsent" when localStorage is empty
- [ ] Scripts don't execute before explicit consent in opt-in mode
- [ ] Banner shows automatically for first-time visitors

#### A2. Initial Events (optional)
**Priority:** Medium

- Emit an optional event `Cookie: Consent Defaulted` (new) informing:
  - `hasConsent: false`
  - `effectiveConsent: denied` per category (by default)
- Controlled by config: `emitDefaultStateEvent`

**Acceptance Criteria:**
- [ ] Event fires on page load when no consent exists
- [ ] Event is configurable (can be disabled)
- [ ] Payload includes all categories as denied

---

### Epic B — Complete Google Consent Mode v2

#### B1. Default Denied (new)
**Priority:** Critical

Implement automatic call (configurable) when loading the component:
- `gtag('consent','default', {... denied ...})`

Must run **as early as possible** (ideally in `mounted()` immediately, or in an "init method" that WeWeb calls on page load).

Minimum values:
- `analytics_storage: 'denied'`
- `ad_storage: 'denied'`
- `ad_user_data: 'denied'`
- `ad_personalization: 'denied'`

**Justification:** The "default" must be executed early and can start everything as denied.

**Acceptance Criteria:**
- [ ] Default denied runs before any scripts execute
- [ ] All 4 consent signals are set to 'denied'
- [ ] Works with async script loading

#### B2. Update on Choice
**Priority:** Critical

When accepting all or saving preferences, call `gtag('consent','update', {...})` reflecting categories.

Example: if analytics=true → `analytics_storage: 'granted'` and the rest remains denied.

Controlled by config: `googleConsentMode.enabled`

**Acceptance Criteria:**
- [ ] Update fires on acceptAll
- [ ] Update fires on savePreferences
- [ ] Only granted categories change to 'granted'

#### B3. Category to Consent Mode Mapping
**Priority:** High

| Category | Consent Mode Signal(s) |
|----------|----------------------|
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |

Optional granular mapping configurable via: `googleConsentMode.mapMarketingToAdsStorage`

**Acceptance Criteria:**
- [ ] Mapping is correct and documented
- [ ] Granular mapping is optional

#### B4. Compatibility with Script Gating
**Priority:** High

Even with Consent Mode, maintain your script gating as a guarantee (defense in depth).

**Acceptance Criteria:**
- [ ] Script gating works independently of Consent Mode
- [ ] Both mechanisms can work together

---

### Epic C — Meta Pixel Notification

#### C1. Update Meta Consent
**Priority:** Medium

- When `marketing` becomes `true`, call `fbq('consent', 'grant')`
- When `marketing` becomes `false`, call `fbq('consent', 'revoke')` (when applicable)
- Controlled by config: `metaPixel.enabled`

> Note: If the pixel isn't even loaded because you keep it gated, the "grant/revoke" only makes sense when `fbq` exists. So the default behavior should be: **safe attempt** (check `typeof fbq === 'function'`).

**Acceptance Criteria:**
- [ ] Grant is called when marketing is accepted
- [ ] Revoke is called when marketing is declined
- [ ] Safe check for fbq existence before calling

---

### Epic D — Cross-Subdomain Synchronization

#### D1. Real Consent Cookie (new)
**Priority:** High

Today you create a simple cookie `cookieConsent=1` as fallback. Update to store:
- A *minimum* of state in cookie (e.g.: version + categories + timestamp) **or** a hash/ID that allows recovering state from `localStorage` when needed
- Config: `storage.cookie.enabled`

**Acceptance Criteria:**
- [ ] Cookie contains meaningful consent data
- [ ] Cookie can bootstrap localStorage on new subdomain

#### D2. Shared Domain Support
**Priority:** High

- Add config `storage.cookie.domain` (e.g.: `.mydomain.com`)
- If set, set cookie with `domain=.mydomain.com` to share between subdomains

**Acceptance Criteria:**
- [ ] Domain config is available in ww-config
- [ ] Cookie is set with proper domain attribute

#### D3. Source of Truth Strategy
**Priority:** Medium

Recommended priority:
1. `localStorage.cookieConsent` (complete)
2. cookie (minimum) for cross-subdomain bootstrap
3. (optional) trigger/workflow for backend

When detecting cross-subdomain cookie and there's no localStorage, "hydrate" localStorage from the cookie.

**Acceptance Criteria:**
- [ ] Priority order is respected
- [ ] Hydration works from cookie to localStorage

#### D4. Compatible Migration
**Priority:** Low

If finding old cookie `cookieConsent=1`, treat as "consent exists" but without categories → open banner or assume "declined" (by config `legacyCookiePolicy`).

**Acceptance Criteria:**
- [ ] Old cookie format is recognized
- [ ] Migration behavior is configurable

---

### Epic E — Better consentId Generation

#### E1. Native UUID
**Priority:** Medium

Replace current `generateConsentId()` with:
- `crypto.randomUUID()` when available
- Fallback to current method when not available

Suggested format: `cc_<uuid-v4>`

**Acceptance Criteria:**
- [ ] UUID is used when crypto.randomUUID is available
- [ ] Fallback works in older browsers
- [ ] Format is cc_<uuid>

#### E2. ConsentId Reuse
**Priority:** Low

Define rule:
- New `consentId` only when user **makes a new choice** (accept/decline/save)
- `getLastConsent()` continues returning the last saved event

**Acceptance Criteria:**
- [ ] ConsentId changes on new choice
- [ ] Same consent retrieval returns same ID

---

### Epic F — More Consistent Public API

#### F1. Action Standardization
**Priority:** High

Today your actions exist and call handlers. Standardize names and signatures:

| Action | Arguments | Description |
|--------|-----------|-------------|
| `showBanner()` | none | Display the consent banner |
| `hideBanner({ reason? })` | `{ reason?: string }` | Hide the consent banner |
| `openPreferences()` | none | Open preferences modal |
| `closePreferences()` | none | Close preferences modal |
| `setConsent(categories, options)` | `{ analytics, marketing, personalization }, { source }` | **New** - General consent setter (replaces `savePreferences`) |
| `resetConsent()` | none | Clear consent and show banner |
| `getConsentStatus()` | none | Return current consent state |

**Acceptance Criteria:**
- [ ] All actions have consistent naming
- [ ] setConsent is more general than savePreferences
- [ ] Backwards compatibility maintained for 1 version

#### F2. Event Standardization
**Priority:** High

Maintain current events and add:

| Event | Label | Payload |
|-------|-------|---------|
| `consentDefaulted` | Cookie: Consent Defaulted | `{ hasConsent: false, effectiveConsent }` |
| `consentChanged` | Cookie: Consent Changed | `{ consentId, categories, timestamp, source }` |

Payload must be consistent with what you already build (consentId, categories, timestamp, browser/page/source/ip).

**Acceptance Criteria:**
- [ ] New events are added
- [ ] Existing events continue to work
- [ ] Payload is consistent across events

#### F3. New Configs (WeWeb props)
**Priority:** High

Add to `ww-config.js`:

| Config | Type | Default | Description |
|--------|------|---------|-------------|
| `googleConsentMode.enabled` | bool | `false` | Enable Google Consent Mode v2 |
| `googleConsentMode.defaultDeniedOnLoad` | bool | `true` | Fire default denied on page load |
| `googleConsentMode.mapMarketingToAdsStorage` | bool | `true` | Map marketing category to ad signals |
| `metaPixel.enabled` | bool | `false` | Enable Meta Pixel consent notifications |
| `storage.cookie.enabled` | bool | `true` | Enable cookie storage |
| `storage.cookie.domain` | text | `""` | Cookie domain for cross-subdomain |
| `emitDefaultStateEvent` | bool | `false` | Emit consentDefaulted event on load |

**Acceptance Criteria:**
- [ ] All configs are in ww-config.js
- [ ] Configs have appropriate defaults
- [ ] Configs are bindable in WeWeb

---

## 6. Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| **Security/Privacy** | Do not enable non-essential scripts before consent (gating remains mandatory) |
| **Compatibility** | Maintain current events and old actions with deprecation (1 version) |
| **Performance** | Init must be lightweight; no mandatory external calls |
| **Reliability** | Tolerate absence of `gtag`/`fbq` without breaking page |

---

## 7. Main Flows

### Flow 1 — First Visit (opt-in)

```
1. No localStorage → state "noConsent"
2. If googleConsentMode.defaultDeniedOnLoad=true, fire default denied
3. Banner appears
4. User chooses:
   - acceptAll → save + enableScripts + (update consent)
   - declineAll → save "false" in categories (scripts remain blocked)
   - save preferences → same
```

### Flow 2 — Different Subdomain

```
1. No localStorage, but cross-subdomain cookie exists
2. Hydrate localStorage and apply state (without showing banner)
3. Apply Consent Mode update according to categories
```

### Flow 3 — Returning Visitor

```
1. localStorage exists and not expired
2. Apply Consent Mode update according to stored categories
3. Enable scripts for granted categories
4. Show manager button (if configured)
```

---

## 8. Acceptance Criteria (Self-check)

- [ ] **Default denied**: On first visit, before click, GA doesn't create cookies and `enableScripts` doesn't execute non-essential scripts
- [ ] **Correct update**: When accepting analytics, `analytics_storage` changes to granted, keeping others denied
- [ ] **Meta**: marketing=true calls `fbq('consent','grant')` only if `fbq` exists
- [ ] **Subdomain**: Consent is recognized on `sub.mydomain.com` when `storage.cookie.domain=.mydomain.com`
- [ ] **consentId**: Becomes UUID (with fallback), replacing current `Date.now()+Math.random()`
- [ ] **API**: `setConsent()` covers the `savePreferences()` case and maintains compatibility for 1 version
- [ ] **Config**: It's possible to completely disable notifications for GA/Meta while keeping only gating

---

## 9. Implementation Plan

| Phase | Deliverables |
|-------|--------------|
| Phase 1 | Config infrastructure (ww-config.js): add new props and defaults |
| Phase 2 | Cross-subdomain storage: cookie domain + hydration |
| Phase 3 | consentId UUID: switch generator + fallback |
| Phase 4 | Consent Mode v2: default denied on load (config), update on accept/decline/save |
| Phase 5 | Meta consent: grant/revoke by config |
| Phase 6 | API: add `setConsent()` + new events + deprecation |

---

## 10. Technical Checklist

### Changes in `wwElement.vue`

- [ ] Add `generateUUID()` function with crypto.randomUUID fallback
- [ ] Update `generateConsentId()` to use new UUID function
- [ ] Add `emitConsentDefaulted()` method
- [ ] Add `updateGoogleConsentMode()` method
- [ ] Add `updateMetaPixelConsent()` method
- [ ] Add `hydrateFromCookie()` method
- [ ] Add `setConsent()` action
- [ ] Add `consentDefaulted` and `consentChanged` events

### Changes in `ww-config.js`

- [ ] Add Google Consent Mode section with enabled, defaultDeniedOnLoad, mapMarketingToAdsStorage
- [ ] Add Meta Pixel section with enabled
- [ ] Add Storage section with cookie.enabled, cookie.domain
- [ ] Add emitDefaultStateEvent config

### Changes in README

- [ ] Document new configs
- [ ] Document new events
- [ ] Document new actions
- [ ] Add Google Consent Mode v2 integration example
- [ ] Add cross-subdomain setup example

---

## 11. References

- [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent)
- [Meta Pixel Consent](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr)
- [Web Crypto API - randomUUID](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [PRD v1](PRD.md)
