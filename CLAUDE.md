# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **WeWeb custom component** for cookie consent management. It's a GDPR/LGPD-compliant Vue 3 component that integrates with WeWeb's visual editor and workflow system.

## Commands

```bash
# Install dependencies
npm install

# Local development server (https://localhost:8080)
npm run serve

# Build for production
npm run build
```

There are no tests or linting commands configured for this project.

## Architecture

### Component Structure

```
wwElement.vue (Main Controller)
├── CookieBanner.vue       # Banner UI with multiple layouts
├── CookiePreferences.vue  # Modal for granular cookie control
├── CookieManager.vue      # Floating button to reopen preferences
├── CategoryToggle.vue     # Toggle switch for cookie categories
└── ExpandableCategory.vue # Expandable list items for "expandable" layout
```

### Key Files

- **`ww-config.js`**: WeWeb editor configuration - defines all properties, actions, and trigger events exposed in the WeWeb editor. This is the source of truth for component configuration.
- **`src/wwElement.vue`**: Main orchestrator containing all business logic, state management, consent storage, and integration with Google Consent Mode v2 / Meta Pixel.
- **`src/components/`**: Presentational components that receive props and emit events.

### WeWeb Integration Patterns

1. **Properties**: Defined in `ww-config.js` under `properties`, accessed via `this.content.*` in Vue
2. **Actions**: Methods in `wwElement.vue` that can be called from WeWeb workflows (e.g., `showBanner()`, `acceptAll()`)
3. **Trigger Events**: Emitted via `this.$emit('trigger-event', { name, event })` to notify WeWeb workflows
4. **Bindable Properties**: Use `this.$emit('update', { propName: value })` to update values that can be bound in WeWeb

### Consent Storage

The component uses dual storage:
1. **localStorage** (`cookieConsent` key): Primary storage with full consent data
2. **HTTP Cookie** (`cookieConsent`): For cross-subdomain sync and server-side access

### CSS Custom Properties

All styling uses CSS variables prefixed with `--cc-*` (e.g., `--cc-bg`, `--cc-primary-bg`, `--cc-zindex`). These are set in `wwElement.vue`'s `cssVars` computed property based on editor configuration.

### Critical WeWeb Rules

When modifying components:
- NO `position: fixed` on root element - use nested container
- NO `name` property at root of `ww-config.js`
- **SYNC REQUIRED**: When adding a new property, it MUST be added to BOTH:
  1. `ww-config.js` (for WeWeb editor UI)
  2. `wwDefaultContent` in `wwElement.vue` (for default values)
- Root element MUST have `min-width` and `min-height`

## Configuration Sections in ww-config.js

The properties are organized into numbered sections:
1. Consent Behavior
2. Cookie Categories (analyticsMode, marketingMode, personalizationMode)
3. Integrations (Google Consent Mode, Meta Pixel)
4. Storage (cross-subdomain cookies)
5. Data Collection (IP, events)
6. Banner Layout
7. Banner Buttons
8. Banner UI Elements
9. Float Button (manager)
10. Visibility Controller
11. Content / i18n
12. Category Labels
13. Expandable Layout
14. Styling (in `section: "style"`)

## Internationalization

Built-in translations are in `TRANSLATIONS` object in `wwElement.vue`. The `effectiveContent` computed property merges translations with user customizations, preserving any custom text the user has set.
