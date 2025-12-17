# Cookie Consent Component for WeWeb

A fully customizable, GDPR-compliant cookie consent component for WeWeb applications built with Vue 3.

> **Translations:** [Leia em Portugues](README.pt-BR.md)

## Quick Start

```bash
# Install dependencies
npm install

# Local development (https://localhost:8080)
npm run serve

# Build for production
npm run build
```

## Documentation

| Document | Description |
|----------|-------------|
| [PRD (EN)](docs/PRD.md) | Product Requirements Document |
| [PRD (PT-BR)](docs/PRD.pt-BR.md) | Documento de Requisitos do Produto |
| [PRD-2 (EN)](docs/PRD-2.md) | PRD Updates: Consent Mode v2, UUID, Cross-subdomain |
| [PRD-2 (PT-BR)](docs/PRD-2.pt-BR.md) | PRD Atualizacoes: Consent Mode v2, UUID, Cross-subdomain |
| [ADR](docs/ADR.md) | Architecture Decision Record |
| [WeWeb Guide](AI_docs/weweb-integration.md) | WeWeb integration guide |

## Features

### Core Functionality
- [x] Cookie consent banner with customizable messaging
- [x] Granular cookie category management (Essential, Analytics, Marketing, Personalization)
- [x] Preferences modal for detailed cookie control
- [x] Persistent manager button for re-accessing preferences
- [x] **Dual storage approach**: localStorage (`cookieConsent` key) + trigger events for workflows
- [x] Cookie storage with configurable expiration
- [x] Script blocking until consent is granted

### PRD-2 Features (v2.0)
- [x] **Google Consent Mode v2**: Default denied on load + update on consent
- [x] **Meta Pixel Integration**: Automatic `fbq('consent', 'grant/revoke')` calls
- [x] **Cross-subdomain sync**: Cookie-based consent sharing between subdomains
- [x] **UUID consent IDs**: Uses `crypto.randomUUID()` with fallback
- [x] **New `setConsent()` action**: Programmatic consent control
- [x] **New events**: `consentDefaulted`, `consentChanged`

### Float Button Behavior (v2.1)
- [x] **Smart visibility**: Float button only appears after decline or close (never after accept)
- [x] **Configurable after decline**: Control whether float shows after user declines all cookies
- [x] **Bot/Crawler detection**: Auto-consent for search engine bots (Googlebot, Bingbot, etc.)

### New Features (v2.2)
- [x] **Language selector**: Switch component language between English (US) and Portuguese (BR)
- [x] **Built-in translations**: Pre-defined translations for all labels (preserves customizations)
- [x] **Privacy link target**: Configure whether privacy policy link opens in new tab or same tab
- [x] **Centered button text**: Button text is always centered for consistent appearance

### Consent Modes
- [x] **Opt-in** (GDPR default): All non-essential cookies blocked until explicit consent
- [x] **Opt-out**: Cookies enabled by default, user can refuse
- [x] **Informational**: Banner only, no user choice required

### Visual Styles
- [x] **Minimal**: Simple banner with accept/decline buttons
- [x] **Standard**: Banner with policy link and action buttons
- [x] **Detailed**: Full preferences panel with category toggles

### Customization
- [x] Position: bottom-left, bottom-right, bottom-center, top-left, top-right, top-center
- [x] Colors: Background, text, buttons, borders (fully customizable)
- [x] Typography: Font family, sizes, weights
- [x] Animations: Slide, fade, or no animation
- [x] i18n: Multi-language support (EN, PT-BR included)

### Compliance
- [x] GDPR (EU & UK)
- [x] ePrivacy Directive (EU Cookie Law)
- [x] CCPA/CPRA (California)
- [x] US State Privacy Laws (Virginia, Colorado, Connecticut, etc.)
- [x] IAB TCF 2.0 ready structure

## Project Structure

```
cookies_vue/
├── src/
│   ├── wwElement.vue              # Main component
│   └── components/
│       ├── CookieBanner.vue       # Banner UI
│       ├── CookiePreferences.vue  # Preferences modal
│       ├── CookieManager.vue      # Manager button
│       └── CategoryToggle.vue     # Category toggle switch
├── docs/
│   ├── ADR.md                     # Architecture decisions
│   ├── PRD.md                     # Product requirements (EN)
│   └── PRD.pt-BR.md              # Product requirements (PT-BR)
├── AI_docs/
│   └── weweb-integration.md       # WeWeb integration notes
├── ww-config.js                   # WeWeb configuration
├── package.json
└── README.md
```

## Configuration Properties

### General Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `componentLanguage` | TextSelect | `en-US` | Component language: en-US, pt-BR |
| `consentMode` | TextSelect | `opt-in` | Consent mode: opt-in, opt-out, informational |
| `bannerStyle` | TextSelect | `standard` | Visual style: minimal, standard, detailed |
| `position` | TextSelect | `bottom-left` | Banner position on screen |
| `showManager` | OnOff | `true` | Show persistent manager button |
| `cookieExpiration` | Number | `365` | Days until consent expires |
| `policyPageUrl` | Text | `""` | URL to privacy policy page |
| `policyLinkNewTab` | OnOff | `true` | Open privacy policy link in new tab |

### Cookie Categories

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `essentialLabel` | Text | `Essential` | Label for essential cookies |
| `essentialDescription` | Text | `...` | Description text |
| `analyticsEnabled` | OnOff | `true` | Enable analytics category |
| `marketingEnabled` | OnOff | `true` | Enable marketing category |
| `personalizationEnabled` | OnOff | `true` | Enable personalization category |

### PRD-2 Settings (v2.0)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `googleConsentModeEnabled` | OnOff | `true` | Enable Google Consent Mode v2 |
| `googleConsentDefaultDenied` | OnOff | `true` | Fire default denied on page load |
| `googleConsentMapMarketing` | OnOff | `true` | Map marketing category to ad signals |
| `metaPixelEnabled` | OnOff | `true` | Enable Meta Pixel consent notifications |
| `storageCookieEnabled` | OnOff | `true` | Enable cookie storage for cross-subdomain |
| `storageCookieDomain` | Text | `""` | Cookie domain (e.g., `.mydomain.com`) |
| `emitDefaultStateEvent` | OnOff | `true` | Emit consentDefaulted event on load |
| `autoConsentBots` | OnOff | `false` | Auto-consent for bots/crawlers |
| `showManagerAfterDecline` | OnOff | `true` | Show float button after user declines |

### Styling

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `backgroundColor` | Color | `#ffffff` | Banner background color |
| `textColor` | Color | `#1f2937` | Primary text color |
| `primaryButtonBg` | Color | `#10b981` | Accept button background |
| `secondaryButtonBg` | Color | `#6b7280` | Decline button background |
| `borderRadius` | Length | `8px` | Corner radius |

### Content (i18n)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `bannerTitle` | Text | `Cookie Consent` | Banner heading |
| `bannerMessage` | Text | `...` | Banner description text |
| `acceptAllLabel` | Text | `Accept All` | Accept button text |
| `declineAllLabel` | Text | `Decline` | Decline button text |
| `preferencesLabel` | Text | `Preferences` | Preferences button text |

## Workflow Actions

### `showBanner()`
Programmatically displays the cookie consent banner.

```javascript
// WeWeb Workflow
Component.showBanner()
```

### `hideBanner()`
Hides the cookie consent banner.

### `openPreferences()`
Opens the preferences modal for granular cookie control.

### `acceptAll()`
Accepts all cookie categories and stores consent.

### `declineAll()`
Declines all non-essential cookies.

### `savePreferences(categories)`
Saves specific category preferences.

```javascript
// Example payload
{
  "analytics": true,
  "marketing": false,
  "personalization": true
}
```

### `resetConsent()`
Clears stored consent and shows banner again.

### `getConsentStatus()`
Returns current consent status for all categories.

### `setConsent(categories, options)` (PRD-2)
Programmatically sets consent with full control. Emits `consentChanged` event.

```javascript
// Example usage
Component.setConsent(
  { analytics: true, marketing: false, personalization: true },
  { source: 'custom-ui' }
)
```

## Trigger Events

All trigger events are prefixed with "Cookie:" for easy identification in WeWeb workflows.

| Event Name | Label (in WeWeb) | Payload | Description |
|------------|------------------|---------|-------------|
| `consentGiven` | Cookie: User Accepted All Cookies | `{ consentId, categories, timestamp }` | User clicked "Accept All" |
| `consentDeclined` | Cookie: User Declined All Cookies | `{ consentId, timestamp }` | User clicked "Decline" |
| `preferencesUpdated` | Cookie: User Saved Custom Preferences | `{ consentId, categories, timestamp }` | User saved custom preferences |
| `bannerShown` | Cookie: Banner Displayed | `{ source? }` | Banner became visible |
| `bannerHidden` | Cookie: Banner Closed | `{ reason }` | Banner was closed (reason: acceptAll, declineAll, savePreferences, manual, controller) |
| `preferencesOpened` | Cookie: Preferences Modal Opened | `{}` | Preferences modal opened |
| `preferencesClosed` | Cookie: Preferences Modal Closed | `{}` | Preferences modal closed |
| `consentStatusRetrieved` | Cookie: Consent Status Retrieved | `{ hasConsent, consent }` | Consent status was retrieved via action |
| `consentDefaulted` | Cookie: Consent Defaulted | `{ hasConsent, effectiveConsent, timestamp }` | **(PRD-2)** Initial denied state applied |
| `consentChanged` | Cookie: Consent Changed | `{ consentId, categories, previousCategories, timestamp, source }` | **(PRD-2)** Any consent change occurred |

### Event Payload Examples

```javascript
// consentGiven event
{
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false,
    "personalization": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// preferencesUpdated event
{
  "categories": {
    "analytics": false,
    "marketing": false,
    "personalization": true
  },
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Custom Triggers (fs-cc Pattern)

The component supports custom HTML attributes for triggering actions, inspired by the Finsweet pattern:

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-cc="banner"` | Div | Identifies the banner wrapper |
| `data-cc="allow"` | Button | Accept all cookies |
| `data-cc="deny"` | Button | Decline non-essential |
| `data-cc="preferences"` | Div | Preferences panel wrapper |
| `data-cc="open-preferences"` | Any | Opens preferences modal |
| `data-cc="close"` | Button | Closes banner/preferences |
| `data-cc="submit"` | Button | Save preferences |
| `data-cc-checkbox="analytics"` | Checkbox | Analytics category toggle |
| `data-cc-checkbox="marketing"` | Checkbox | Marketing category toggle |
| `data-cc-checkbox="personalization"` | Checkbox | Personalization toggle |

## localStorage Data Structure

The component automatically stores consent data in localStorage with the key `cookieConsent`:

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

### Reading Consent Status

```javascript
// Check consent from localStorage
const consent = JSON.parse(localStorage.getItem('cookieConsent'));

if (consent) {
  console.log('Consent given at:', consent.timestamp);
  console.log('Analytics allowed:', consent.categories.analytics);
  console.log('Marketing allowed:', consent.categories.marketing);
}
```

### Dual Approach Benefits

1. **localStorage (`cookieConsent`)**: Automatic persistence, available on page load
2. **Trigger Events**: Send to WeWeb workflows for database storage, analytics integration, etc.

## Usage Examples

### Basic Implementation

1. Add the component to your WeWeb page
2. Configure the policy page URL
3. Customize colors to match your brand
4. Set up workflow triggers for consent events

### With Google Analytics

```javascript
// On 'consentGiven' event
if (event.categories.analytics) {
  // Initialize Google Analytics
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
}
```

### Script Gating

Mark scripts with the `data-cc-category` attribute to control execution:

```html
<script data-cc-category="analytics" type="text/plain">
  // This script only runs if analytics consent is given
</script>
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## References

- [Shadcn Cookie Consent](https://shadcnstudio.com/blocks/marketing-ui/cookies-consent)
- [Finsweet Cookie Consent](https://finsweet.com/cookie-consent)
- [Vaadin Cookie Consent](https://github.com/vaadin/vaadin-cookie-consent)
- [Figma Cookie Consent UI Kit](https://www.figma.com/community/file/972524923877381263)
