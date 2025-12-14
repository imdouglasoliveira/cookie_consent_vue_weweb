# PRD: Cookie Consent Component for WeWeb

**Version:** 1.0
**Date:** 2024-12-14
**Status:** Draft
**Author:** Development Team

---

## 1. Overview

### 1.1 Purpose
Create a fully customizable, privacy-compliant cookie consent component for WeWeb applications that enables website owners to:
- Collect user consent for cookie usage
- Provide granular control over cookie categories
- Comply with international privacy regulations (GDPR, LGPD, CCPA)
- Integrate seamlessly with WeWeb workflows

### 1.2 Background
Modern privacy regulations require explicit user consent before storing non-essential cookies. This component provides a complete solution for managing cookie consent in WeWeb applications, supporting multiple consent modes, visual styles, and integration patterns.

### 1.3 Target Users
- WeWeb application developers
- Marketing teams needing analytics/advertising consent
- Legal/compliance teams ensuring regulatory adherence
- End-users making privacy choices

---

## 2. Objectives

| ID | Objective | Success Metric |
|----|-----------|----------------|
| O-01 | Simplify privacy compliance | < 5 minutes to implement basic consent |
| O-02 | Provide flexibility | 3+ visual styles, 6+ position options |
| O-03 | Enable workflow integration | All actions accessible via WeWeb workflows |
| O-04 | Support major regulations | GDPR, LGPD, CCPA compliance ready |
| O-05 | Maintain performance | < 20KB bundle size, < 100ms render time |

---

## 3. Functional Requirements

### 3.1 Core Features

#### RF-01: Cookie Banner Display
**Priority:** Critical

The component MUST display a cookie consent banner with:
- Configurable title and message text
- Link to privacy policy page
- Action buttons (Accept, Decline, Preferences)
- Optional close button (for informational mode)

**Acceptance Criteria:**
- [ ] Banner appears on first visit when no consent stored
- [ ] Banner respects configured position (6 options)
- [ ] Banner is responsive (adapts to mobile screens)
- [ ] Banner supports 3 visual styles (minimal, standard, detailed)

#### RF-02: Consent Modes
**Priority:** Critical

The component MUST support three consent modes:

| Mode | Behavior |
|------|----------|
| `opt-in` | Block all non-essential cookies until explicit consent (GDPR default) |
| `opt-out` | Enable cookies by default, allow user to refuse |
| `informational` | Display notice only, no blocking or choice required |

**Acceptance Criteria:**
- [ ] Default mode is `opt-in`
- [ ] Mode is configurable via ww-config property
- [ ] Script blocking respects current mode

#### RF-03: Cookie Categories
**Priority:** Critical

The component MUST manage four cookie categories:

| Category | Required | Can Disable |
|----------|----------|-------------|
| Essential | Yes | No |
| Analytics | No | Yes |
| Marketing | No | Yes |
| Personalization | No | Yes |

**Acceptance Criteria:**
- [ ] Essential category is always enabled
- [ ] User can toggle each optional category
- [ ] Category preferences persist across sessions
- [ ] Each category has customizable label and description

#### RF-04: Preferences Modal
**Priority:** High

The component MUST provide a preferences modal with:
- Toggle switch for each cookie category
- Description text for each category
- Accept All / Reject All buttons
- Save Preferences button

**Acceptance Criteria:**
- [ ] Modal opens from banner "Preferences" button
- [ ] Modal opens from manager button
- [ ] Modal can be opened via workflow action
- [ ] Modal displays current consent state
- [ ] Modal is accessible (keyboard navigation, focus trap)

#### RF-05: Manager Button
**Priority:** High

The component MUST provide a persistent manager button:
- Fixed position on screen (configurable)
- Opens preferences modal on click
- Can be hidden via configuration

**Acceptance Criteria:**
- [ ] Button appears after initial consent given
- [ ] Button position is configurable
- [ ] Button can be styled (icon, colors)
- [ ] Button can be disabled via configuration

#### RF-06: Consent Storage
**Priority:** Critical

The component MUST store consent data using a **dual approach**:
1. **Trigger Events**: Send consent data to WeWeb workflows for custom handling (database, analytics, etc.)
2. **localStorage**: Automatically persist consent with key `cookieConsent`

**Storage Details:**
- Primary storage: localStorage with key `cookieConsent`
- Fallback: HTTP cookie `cookieConsent=1`
- Data includes: version, timestamp, consentId, categories, expiration

**Consent Data Structure (localStorage key: `cookieConsent`):**
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "consentId": "cc_abc123xyz",
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

**Reading Consent (JavaScript):**
```javascript
const consent = JSON.parse(localStorage.getItem('cookieConsent'));
if (consent?.categories?.analytics) {
  // User allowed analytics cookies
}
```

**Acceptance Criteria:**
- [ ] Consent persists in localStorage with key `cookieConsent`
- [ ] Consent data sent via trigger events for workflow integration
- [ ] Consent expires after configured days (default: 365)
- [ ] Consent version enables re-consent on policy changes
- [ ] Can be cleared via workflow action (`resetConsent`)
- [ ] Unique `consentId` generated for each consent record

#### RF-07: Script Gating
**Priority:** High

The component MUST control script execution based on consent:

```html
<script type="text/plain" data-cc-category="analytics">
  // Blocked until analytics consent
</script>
```

**Acceptance Criteria:**
- [ ] Scripts with `type="text/plain"` and `data-cc-category` are blocked
- [ ] Scripts execute immediately when category consent is given
- [ ] Works with inline scripts and external src
- [ ] No execution before consent in opt-in mode

#### RF-08: Custom Trigger Attributes
**Priority:** Medium

The component MUST support HTML attribute-based triggers:

| Attribute | Action |
|-----------|--------|
| `data-cc="allow"` | Accept all cookies |
| `data-cc="deny"` | Decline all non-essential |
| `data-cc="open-preferences"` | Open preferences modal |
| `data-cc="close"` | Close banner/modal |
| `data-cc="submit"` | Save current preferences |
| `data-cc-checkbox="[category]"` | Toggle specific category |

**Acceptance Criteria:**
- [ ] Attributes work on any clickable element
- [ ] Checkbox attributes sync with component state
- [ ] Works outside Vue component boundaries

### 3.2 WeWeb Integration

#### RF-09: Workflow Actions
**Priority:** Critical

The component MUST expose these actions to WeWeb workflows:

| Action | Arguments | Description |
|--------|-----------|-------------|
| `showBanner()` | none | Display the consent banner |
| `hideBanner()` | none | Hide the consent banner |
| `openPreferences()` | none | Open preferences modal |
| `closePreferences()` | none | Close preferences modal |
| `acceptAll()` | none | Accept all cookie categories |
| `declineAll()` | none | Decline non-essential cookies |
| `savePreferences(categories)` | `{ analytics, marketing, personalization }` | Save specific preferences |
| `resetConsent()` | none | Clear consent and show banner |
| `getConsentStatus()` | none | Return current consent state |

**Acceptance Criteria:**
- [ ] All actions callable from WeWeb workflow
- [ ] Actions have clear labels (EN/PT)
- [ ] Arguments are properly typed and bindable

#### RF-10: Trigger Events
**Priority:** Critical

The component MUST emit these events to WeWeb workflows. All events are prefixed with "Cookie:" for easy identification in the workflow editor:

| Event Name | Label (in WeWeb) | Payload | When Fired |
|------------|------------------|---------|------------|
| `consentGiven` | Cookie: User Accepted All Cookies | `{ consentId, categories, timestamp }` | User clicks "Accept All" |
| `consentDeclined` | Cookie: User Declined All Cookies | `{ consentId, timestamp }` | User clicks "Decline" |
| `preferencesUpdated` | Cookie: User Saved Custom Preferences | `{ consentId, categories, timestamp }` | User saves custom preferences |
| `bannerShown` | Cookie: Banner Displayed | `{ source? }` | Banner becomes visible |
| `bannerHidden` | Cookie: Banner Closed | `{ reason }` | Banner is closed |
| `preferencesOpened` | Cookie: Preferences Modal Opened | `{}` | Preferences modal opens |
| `preferencesClosed` | Cookie: Preferences Modal Closed | `{}` | Preferences modal closes |
| `consentStatusRetrieved` | Cookie: Consent Status Retrieved | `{ hasConsent, consent }` | Consent status retrieved via action |

**Naming Convention:**
- All labels prefixed with "Cookie:" for easy filtering in WeWeb dropdown
- Labels describe the user action clearly (e.g., "User Accepted All Cookies" vs just "Consent Given")
- Reason values for `bannerHidden`: `acceptAll`, `declineAll`, `savePreferences`, `manual`, `controller`

**Acceptance Criteria:**
- [ ] Events fire at correct times
- [ ] Payloads contain specified data
- [ ] Events appear in WeWeb workflow editor with clear "Cookie:" prefix
- [ ] Labels are descriptive enough to understand without documentation

### 3.3 Customization

#### RF-11: Visual Styles
**Priority:** High

Three built-in visual styles:

**Minimal:**
- Single line banner
- Icon + message + buttons inline
- No title

**Standard:**
- Card-based banner
- Title, message, policy link
- Stacked or inline buttons

**Detailed:**
- Full preferences panel inline
- Category toggles visible
- Expanded descriptions

**Acceptance Criteria:**
- [ ] Style selectable via dropdown
- [ ] Each style is responsive
- [ ] Styles work with all position options

#### RF-12: Position Options
**Priority:** High

| Option | Desktop | Mobile |
|--------|---------|--------|
| `bottom-left` | Fixed, 24px from edges | Full width, 16px from bottom |
| `bottom-right` | Fixed, 24px from edges | Full width, 16px from bottom |
| `bottom-center` | Fixed, centered, 24px from bottom | Full width, 16px from bottom |
| `top-left` | Fixed, 24px from edges | Full width, 16px from top |
| `top-right` | Fixed, 24px from edges | Full width, 16px from top |
| `top-center` | Fixed, centered, 24px from top | Full width, 16px from top |

**Acceptance Criteria:**
- [ ] All 6 positions available
- [ ] Mobile breakpoint at 768px
- [ ] Smooth animations between states

#### RF-13: Color Customization
**Priority:** High

Customizable colors:
- Background color
- Text color (primary and secondary)
- Primary button (background, text, hover)
- Secondary button (background, text, hover)
- Border color
- Toggle switch colors (on/off)
- Link color

**Acceptance Criteria:**
- [ ] All colors configurable via WeWeb editor
- [ ] Colors support binding to variables
- [ ] Default colors provide good contrast (WCAG AA)

#### RF-14: Typography
**Priority:** Medium

Customizable typography:
- Font family (inherit or custom)
- Title font size
- Body text font size
- Button font size
- Line height

**Acceptance Criteria:**
- [ ] Inherits page font by default
- [ ] Size options with reasonable min/max

#### RF-15: Content Localization
**Priority:** High

All text content configurable:
- Banner title
- Banner message
- Accept button label
- Decline button label
- Preferences button label
- Category labels (4)
- Category descriptions (4)
- Save button label
- Close button label

**Acceptance Criteria:**
- [ ] Default content in English
- [ ] All content supports WeWeb binding
- [ ] Labels available in EN and PT-BR

### 3.4 Accessibility

#### RF-16: Keyboard Navigation
**Priority:** High

- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modal
- Arrow keys for toggles

**Acceptance Criteria:**
- [ ] Full keyboard operability
- [ ] Visible focus indicators
- [ ] Logical tab order

#### RF-17: Screen Reader Support
**Priority:** High

- ARIA labels on all interactive elements
- Role attributes where appropriate
- Live region announcements for state changes

**Acceptance Criteria:**
- [ ] Works with NVDA, VoiceOver, JAWS
- [ ] Announces consent actions
- [ ] Modal announced when opened

#### RF-18: Focus Management
**Priority:** Medium

- Focus trap in modal
- Return focus on modal close
- Auto-focus first interactive element

**Acceptance Criteria:**
- [ ] Cannot tab outside modal when open
- [ ] Focus returns to trigger element on close

---

## 4. Non-Functional Requirements

### 4.1 Performance

| Metric | Target |
|--------|--------|
| Bundle size | < 20KB gzipped |
| Initial render | < 100ms |
| Consent check | < 10ms |
| No layout shift | CLS = 0 |

### 4.2 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| Opera | 67+ |

### 4.3 Security

- No external API calls
- No third-party dependencies for core functionality
- XSS prevention in user content
- Cookie security attributes (SameSite, Secure in HTTPS)

---

## 5. User Interface

### 5.1 Banner States

```
┌─────────────────────────────────────────────────────────────────┐
│                          INITIAL STATE                          │
│  Banner visible, no consent stored                              │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ACCEPTED ALL   │ │ DECLINED ALL    │ │ PREFERENCES     │
│  Banner hidden  │ │ Banner hidden   │ │ Modal opened    │
│  Manager shown  │ │ Manager shown   │ │                 │
└─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              ▼                   ▼                   ▼
                    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
                    │  SAVED PREFS    │ │  ACCEPT ALL     │ │  REJECT ALL     │
                    │  Modal closed   │ │  Modal closed   │ │  Modal closed   │
                    │  Manager shown  │ │  Manager shown  │ │  Manager shown  │
                    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 5.2 Component Hierarchy

```
wwElement.vue
├── Editor Placeholder (visible in WeWeb editor when no content)
│
├── Cookie Banner
│   ├── Cookie Icon
│   ├── Title
│   ├── Message
│   ├── Policy Link
│   └── Button Group
│       ├── Accept All Button
│       ├── Decline Button
│       └── Preferences Button
│
├── Preferences Modal
│   ├── Header
│   │   ├── Title
│   │   └── Close Button
│   ├── Category List
│   │   ├── Essential (always on)
│   │   ├── Analytics Toggle
│   │   ├── Marketing Toggle
│   │   └── Personalization Toggle
│   └── Footer
│       ├── Reject All Button
│       ├── Accept All Button
│       └── Save Preferences Button
│
└── Manager Button
    └── Cookie Icon + Label
```

---

## 6. Data Models

### 6.1 Consent Object

```typescript
interface ConsentData {
  version: string;           // Component version for re-consent
  timestamp: string;         // ISO 8601 datetime
  mode: 'opt-in' | 'opt-out' | 'informational';
  categories: {
    essential: true;         // Always true
    analytics: boolean;
    marketing: boolean;
    personalization: boolean;
  };
  expiration: string;        // ISO 8601 datetime
}
```

### 6.2 Configuration Object

```typescript
interface ComponentConfig {
  // General
  consentMode: 'opt-in' | 'opt-out' | 'informational';
  bannerStyle: 'minimal' | 'standard' | 'detailed';
  position: 'bottom-left' | 'bottom-right' | 'bottom-center' |
            'top-left' | 'top-right' | 'top-center';
  showManager: boolean;
  cookieExpiration: number;  // Days
  policyPageUrl: string;

  // Categories
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  personalizationEnabled: boolean;

  // Content
  bannerTitle: string;
  bannerMessage: string;
  acceptAllLabel: string;
  declineAllLabel: string;
  preferencesLabel: string;
  // ... category labels and descriptions

  // Styling
  backgroundColor: string;
  textColor: string;
  primaryButtonBg: string;
  primaryButtonText: string;
  secondaryButtonBg: string;
  secondaryButtonText: string;
  borderRadius: string;
  // ... additional style props
}
```

---

## 7. Integration Examples

### 7.1 Basic Setup

1. Add Cookie Consent component to page
2. Set `policyPageUrl` to your privacy policy
3. Customize colors to match brand
4. Configure workflow triggers

### 7.2 Google Analytics Integration

```javascript
// On 'consentGiven' event
if (event.categories.analytics) {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

### 7.3 Meta Pixel Integration

```javascript
// On 'consentGiven' event
if (event.categories.marketing) {
  fbq('consent', 'grant');
}
```

---

## 8. Timeline

| Phase | Deliverables | Duration |
|-------|--------------|----------|
| Phase 1 | Core banner, consent storage, basic styling | - |
| Phase 2 | Preferences modal, category management | - |
| Phase 3 | WeWeb actions/events integration | - |
| Phase 4 | Script gating, custom triggers | - |
| Phase 5 | Testing, documentation, polish | - |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption | - | Number of WeWeb apps using component |
| Consent rate | > 60% | Users accepting vs declining |
| Support tickets | < 5/month | Issues reported |
| Performance | < 100ms render | Lighthouse metrics |

---

## 10. Open Questions

1. Should we support IAB TCF 2.0 vendor list integration?
2. Should consent sync across subdomains?
3. Should we provide built-in Google Consent Mode v2 integration?
4. Should the manager button be a separate component?

---

## 11. References

- [GDPR Cookie Requirements](https://gdpr.eu/cookies/)
- [LGPD Guidelines](https://lgpd.com.br/)
- [CCPA Cookie Requirements](https://oag.ca.gov/privacy/ccpa)
- [WeWeb Component Documentation](https://developer.weweb.io/)
- [Shadcn Cookie Consent](https://shadcnstudio.com/blocks/marketing-ui/cookies-consent)
- [Finsweet Cookie Consent](https://finsweet.com/cookie-consent)
