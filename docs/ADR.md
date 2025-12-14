# ADR-001: Cookie Consent Component Architecture

## Status
**Proposed** | 2024-12-14

## Context

We need to create a cookie consent component for WeWeb that:

1. Complies with GDPR, LGPD, CCPA, and other privacy regulations
2. Provides granular control over cookie categories
3. Integrates seamlessly with WeWeb's workflow system
4. Supports multiple visual styles and customization options
5. Works with third-party scripts (Google Analytics, Meta Pixel, etc.)
6. Follows the established patterns from toast_notification_vue and nps_vue components

### Key Requirements from Analysis

Based on research of Shadcn, Finsweet, and Vaadin cookie consent implementations:

- **Finsweet Pattern**: Attribute-based triggers (`fs-cc="allow"`, `fs-cc="deny"`) provide flexible HTML-based control
- **Shadcn Pattern**: Multiple visual variations (minimal, standard, detailed) with consistent API
- **Vaadin Pattern**: Simple web component with minimal configuration overhead
- **WeWeb Pattern**: Actions, trigger events, and `content` props for editor integration

## Decision

### 1. Component Architecture

We will implement a **three-component system**:

```
wwElement.vue (Main Controller)
├── CookieBanner.vue (Initial consent UI)
├── CookiePreferences.vue (Granular settings modal)
└── CookieManager.vue (Persistent access button)
```

**Rationale**: This separation allows:
- Independent visibility control for each UI element
- Clean state management in the parent component
- Reusable sub-components for potential standalone use

### 2. Consent Storage Strategy

**Decision**: Use **localStorage** with key `cookieConsent` + cookie fallback

The component uses a **dual approach**:
1. **Trigger Events**: Send consent data to WeWeb workflows for custom handling
2. **localStorage**: Automatically persist consent with key `cookieConsent`

```javascript
// Primary: localStorage with key "cookieConsent"
const consentData = {
  version: '1.0',
  timestamp: '2024-01-15T10:30:00.000Z',
  consentId: 'cc_abc123xyz',  // Unique identifier for this consent
  categories: {
    essential: true,
    analytics: false,
    marketing: false,
    personalization: true
  },
  expiration: '2025-01-15T10:30:00.000Z'
};

localStorage.setItem('cookieConsent', JSON.stringify(consentData));

// Fallback: HTTP cookie (for server-side access)
document.cookie = 'cookieConsent=1; max-age=31536000; path=/; SameSite=Lax';
```

**Reading consent status:**
```javascript
// Check if consent exists
const consent = JSON.parse(localStorage.getItem('cookieConsent'));
if (consent && consent.categories.analytics) {
  // Analytics allowed
}
```

**Rationale**:
- localStorage provides structured JSON storage
- Key `cookieConsent` is intuitive and easy to find in DevTools
- Trigger events allow custom integrations via workflows
- Cookie fallback enables server-side consent checking
- No external dependencies

### 3. Cookie Categories

**Decision**: Four standard categories with extensibility

| Category | Required | Default | Description |
|----------|----------|---------|-------------|
| `essential` | Yes (always on) | `true` | Site functionality, security |
| `analytics` | No | `false` | Performance tracking, UX data |
| `marketing` | No | `false` | Advertising, retargeting |
| `personalization` | No | `false` | User preferences, location |

**Payload Contract**:

```json
// Minimal payload (acceptAll)
{
  "action": "acceptAll"
}

// Full payload (savePreferences)
{
  "action": "savePreferences",
  "categories": {
    "analytics": true,
    "marketing": false,
    "personalization": true
  }
}

// Stored consent object
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "mode": "opt-in",
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false,
    "personalization": true
  },
  "expiration": "2025-01-15T10:30:00.000Z"
}
```

### 4. Consent Modes

**Decision**: Three operational modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `opt-in` | All blocked until explicit consent | GDPR/LGPD compliance (default) |
| `opt-out` | All enabled, user can refuse | More permissive regions |
| `informational` | Banner only, no blocking | Informative notice only |

### 5. Trigger Attribute Pattern

**Decision**: Adopt `data-cc` attribute pattern (inspired by Finsweet's `fs-cc`)

```html
<!-- Banner wrapper -->
<div data-cc="banner">
  <button data-cc="allow">Accept All</button>
  <button data-cc="deny">Decline</button>
  <button data-cc="open-preferences">Manage</button>
</div>

<!-- Preferences modal -->
<div data-cc="preferences">
  <input type="checkbox" data-cc-checkbox="analytics" />
  <input type="checkbox" data-cc-checkbox="marketing" />
  <button data-cc="submit">Save Preferences</button>
</div>

<!-- Manager button -->
<div data-cc="manager">
  <button data-cc="open-preferences">Cookie Settings</button>
</div>
```

**Rationale**:
- Familiar pattern for developers coming from Finsweet
- Enables custom HTML implementations
- Works outside Vue component boundaries

### 6. Script Gating

**Decision**: Type-attribute based script blocking

```html
<!-- Blocked until analytics consent -->
<script type="text/plain" data-cc-category="analytics">
  // Google Analytics code
</script>

<!-- After consent, component changes type to text/javascript -->
<script type="text/javascript" data-cc-category="analytics">
  // Now executes
</script>
```

**Implementation**:
```javascript
function enableScripts(category) {
  document.querySelectorAll(`script[data-cc-category="${category}"]`)
    .forEach(script => {
      if (script.type === 'text/plain') {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        newScript.type = 'text/javascript';
        script.parentNode.replaceChild(newScript, script);
      }
    });
}
```

### 7. Visual Styles

**Decision**: Three built-in styles with full customization

#### Minimal Style
```
┌─────────────────────────────────────────────────────────────┐
│ 🍪 We use cookies to enhance your experience.  [Accept] [Decline] │
└─────────────────────────────────────────────────────────────┘
```

#### Standard Style
```
┌──────────────────────────────────────────────────────────────────┐
│ 🍪 Cookie Consent                                                │
│                                                                   │
│ We use cookies to enhance your browsing experience, analyze      │
│ site traffic, and personalize content. View our Privacy Policy.  │
│                                                                   │
│              [Preferences]  [Decline]  [Accept All]              │
└──────────────────────────────────────────────────────────────────┘
```

#### Detailed Style (Preferences Panel)
```
┌──────────────────────────────────────────────────────────────────┐
│ 🍪 Privacy Preferences                                     [X]  │
├──────────────────────────────────────────────────────────────────┤
│ Essential Cookies                              [Required ✓]     │
│ Required for basic website functionality                         │
├──────────────────────────────────────────────────────────────────┤
│ Analytics Cookies                              [Toggle ○]       │
│ Help us understand how visitors interact with our website        │
├──────────────────────────────────────────────────────────────────┤
│ Marketing Cookies                              [Toggle ○]       │
│ Used to deliver relevant advertisements                          │
├──────────────────────────────────────────────────────────────────┤
│ Personalization Cookies                        [Toggle ○]       │
│ Remember your preferences and customize experience               │
├──────────────────────────────────────────────────────────────────┤
│     [Reject All]        [Accept All]        [Save Preferences]   │
└──────────────────────────────────────────────────────────────────┘
```

### 8. WeWeb Integration

**Actions** (Workflow callable):
```javascript
actions: [
  { action: 'showBanner', args: [] },
  { action: 'hideBanner', args: [] },
  { action: 'openPreferences', args: [] },
  { action: 'closePreferences', args: [] },
  { action: 'acceptAll', args: [] },
  { action: 'declineAll', args: [] },
  {
    action: 'savePreferences',
    args: [{ name: 'categories', type: 'object', bindable: true }]
  },
  { action: 'resetConsent', args: [] },
  { action: 'getConsentStatus', args: [] }
]
```

**Trigger Events** (prefixed with "Cookie:" for clear identification in WeWeb):
```javascript
triggerEvents: [
  { name: 'consentGiven', label: 'Cookie: User Accepted All Cookies', event: { consentId, categories, timestamp } },
  { name: 'consentDeclined', label: 'Cookie: User Declined All Cookies', event: { consentId, timestamp } },
  { name: 'preferencesUpdated', label: 'Cookie: User Saved Custom Preferences', event: { consentId, categories, timestamp } },
  { name: 'bannerShown', label: 'Cookie: Banner Displayed', event: { source? } },
  { name: 'bannerHidden', label: 'Cookie: Banner Closed', event: { reason } },
  { name: 'preferencesOpened', label: 'Cookie: Preferences Modal Opened', event: {} },
  { name: 'preferencesClosed', label: 'Cookie: Preferences Modal Closed', event: {} },
  { name: 'consentStatusRetrieved', label: 'Cookie: Consent Status Retrieved', event: { hasConsent, consent } }
]
```

**Naming Convention Rationale**:
- All labels prefixed with "Cookie:" for easy filtering in WeWeb workflow dropdown
- Labels describe the user action clearly (e.g., "User Accepted All Cookies" vs just "Consent Given")
- Internal event names remain camelCase for code consistency

### 9. Position Options

**Decision**: Six position options with responsive behavior

| Position | Desktop | Mobile |
|----------|---------|--------|
| `bottom-left` | Fixed bottom-left | Full width bottom |
| `bottom-right` | Fixed bottom-right | Full width bottom |
| `bottom-center` | Fixed bottom-center | Full width bottom |
| `top-left` | Fixed top-left | Full width top |
| `top-right` | Fixed top-right | Full width top |
| `top-center` | Fixed top-center | Full width top |

### 10. Accessibility

**Decision**: WCAG 2.1 AA compliance

- Focus trap in preferences modal
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels and roles
- Sufficient color contrast
- Screen reader announcements

## Alternatives Considered

### Alternative 1: Single Monolithic Component
**Rejected** because:
- Harder to maintain
- Less flexible for customization
- Larger bundle size when only partial features needed

### Alternative 2: Cookie-only Storage (no localStorage)
**Rejected** because:
- Limited to 4KB storage
- Harder to store complex JSON structures
- Sent with every HTTP request (performance impact)

### Alternative 3: External Consent Service Integration
**Rejected** because:
- Adds external dependency
- Privacy concerns with third-party services
- Increased complexity for simple use cases

## Consequences

### Positive
- Clean separation of concerns
- Familiar patterns for developers
- Full WeWeb integration
- Compliance with major privacy regulations
- Extensible for future requirements

### Negative
- More complex initial setup than single-file solution
- Requires localStorage support (99.9% browser coverage)
- Custom attribute pattern requires documentation

### Risks
- Breaking changes in WeWeb CLI could affect build
- Browser privacy features may block localStorage in some contexts

## Implementation Notes

### File Structure
```
src/
├── wwElement.vue           # Main orchestrator
├── components/
│   ├── CookieBanner.vue    # Banner UI
│   ├── CookiePreferences.vue # Modal UI
│   ├── CookieManager.vue   # Manager button
│   └── CategoryToggle.vue  # Reusable toggle
├── composables/
│   └── useConsent.js       # Consent state management
└── utils/
    ├── storage.js          # localStorage/cookie helpers
    └── scripts.js          # Script gating utilities
```

### Critical WeWeb Rules
1. NO `position: fixed` on root element (use nested container)
2. NO `name` property at root of ww-config.js
3. `wwDefaultContent` MUST include ALL properties
4. Root element MUST have `min-width` and `min-height`

## References

- [GDPR Cookie Consent Requirements](https://gdpr.eu/cookies/)
- [LGPD Cookie Requirements](https://lgpd.com.br/)
- [IAB TCF 2.0 Specification](https://iabeurope.eu/tcf-2-0/)
- [Finsweet Cookie Consent](https://finsweet.com/cookie-consent)
- [WeWeb Developer Docs](https://developer.weweb.io/)
