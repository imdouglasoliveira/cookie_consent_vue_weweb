<template>
  <div v-if="shouldRenderComponent" class="cc-host" :class="hostClass" :style="cssVars">
    <!-- Editor Placeholder -->
    <div v-if="showPlaceholder" class="cc-editor-placeholder">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
      <span>Cookie Consent</span>
      <small>Configure actions in workflows</small>
    </div>

    <!-- Cookie Banner -->
    <CookieBanner
      v-if="showBannerState"
      :content="content"
      :temp-preferences="tempPreferences"
      @accept-all="handleAcceptAll"
      @decline-all="handleDeclineAll"
      @open-preferences="handleOpenPreferences"
      @update-preference="handleUpdatePreference"
    />

    <!-- Preferences Modal -->
    <CookiePreferences
      v-if="showPreferencesState"
      :content="content"
      :temp-preferences="tempPreferences"
      @close="handleClosePreferences"
      @accept-all="handleAcceptAll"
      @decline-all="handleDeclineAll"
      @save="handleSavePreferences"
      @update-preference="handleUpdatePreference"
    />

    <!-- Manager Button -->
    <CookieManager
      v-if="showManagerState"
      :content="content"
      @open-preferences="handleOpenPreferences"
    />
  </div>
</template>

<script>
import CookieBanner from './components/CookieBanner.vue';
import CookiePreferences from './components/CookiePreferences.vue';
import CookieManager from './components/CookieManager.vue';

const STORAGE_KEY = 'cookieConsent';
const COOKIE_NAME = 'cookieConsent';

export default {
  name: 'CookieConsent',
  components: {
    CookieBanner,
    CookiePreferences,
    CookieManager,
  },
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      showBannerState: false,
      showPreferencesState: false,
      consentGiven: false,
      tempPreferences: {
        analytics: false,
        marketing: false,
        personalization: false,
      },
      // Interaction tracking
      bannerDisplayTime: null,
      // IP data (fetched async)
      ipData: null,
      // Last consent data (for bindable output)
      lastConsentData: null,
    };
  },
  computed: {
    shouldRenderComponent() {
      // Always show in editor (placeholder visible)
      if (this.content.showEditorPlaceholder) {
        return true;
      }
      // Show if banner or preferences are active
      if (this.showBannerState || this.showPreferencesState) {
        return true;
      }
      // Show if manager button should be visible
      if (this.showManagerState) {
        return true;
      }
      // Hide completely if consent given and no UI needed
      return false;
    },
    showPlaceholder() {
      return (
        this.content.showEditorPlaceholder === true &&
        !this.showBannerState &&
        !this.showPreferencesState
      );
    },
    showManagerState() {
      return this.content.showManager && this.consentGiven && !this.showBannerState && !this.showPreferencesState;
    },
    hostClass() {
      return {
        'cc-host-fullwidth': this.content.bannerLayout === 'banner',
      };
    },
    cssVars() {
      const shadowMap = {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      };

      return {
        '--cc-bg': this.content.backgroundColor,
        '--cc-text': this.content.textColor,
        '--cc-text-secondary': this.content.secondaryTextColor,
        '--cc-primary-bg': this.content.primaryButtonBg,
        '--cc-primary-text': this.content.primaryButtonText,
        '--cc-primary-hover': this.content.primaryButtonHover,
        '--cc-secondary-bg': this.content.secondaryButtonBg,
        '--cc-secondary-text': this.content.secondaryButtonText,
        '--cc-secondary-hover': this.content.secondaryButtonHover,
        '--cc-border': this.content.borderColor,
        '--cc-toggle-on': this.content.toggleOnColor,
        '--cc-toggle-off': this.content.toggleOffColor,
        '--cc-link': this.content.linkColor,
        '--cc-radius': this.content.borderRadius,
        '--cc-shadow': shadowMap[this.content.boxShadow] || shadowMap.lg,
      };
    },
  },
  wwDefaultContent: {
    // Visibility Controller
    isOpen: null,
    // General
    consentMode: 'opt-in',
    bannerStyle: 'standard',
    position: 'bottom-left',
    showManager: true,
    managerPosition: 'bottom-left',
    cookieExpiration: 365,
    policyPageUrl: '/privacy-policy',
    showEditorPlaceholder: true,
    // Layout
    bannerLayout: 'card',
    bannerWidth: 'auto',
    buttonLayout: 'horizontal',
    // UI Options
    showDeclineButton: true,
    showPreferencesButton: true,
    showCloseButton: false,
    showCookieIcon: true,
    iconStyle: 'default',
    showPolicyLink: true,
    // Data Collection
    collectIpAddress: true,
    // Google Consent Mode v2 (PRD-2)
    googleConsentModeEnabled: false,
    googleConsentDefaultDenied: true,
    googleConsentMapMarketing: true,
    // Meta Pixel (PRD-2)
    metaPixelEnabled: false,
    // Cross-subdomain storage (PRD-2)
    storageCookieEnabled: true,
    storageCookieDomain: '',
    // Events options (PRD-2)
    emitDefaultStateEvent: false,
    // Bindable output
    lastConsentData: null,
    // Categories
    analyticsEnabled: true,
    marketingEnabled: true,
    personalizationEnabled: true,
    // Content
    bannerTitle: 'Cookie Consent',
    bannerMessage: 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.',
    acceptAllLabel: 'Accept All',
    declineAllLabel: 'Decline',
    preferencesLabel: 'Preferences',
    savePreferencesLabel: 'Save Preferences',
    policyLinkLabel: 'Privacy Policy',
    essentialLabel: 'Essential',
    essentialDescription: 'Required for basic website functionality and security.',
    analyticsLabel: 'Analytics',
    analyticsDescription: 'Help us understand how visitors interact with our website.',
    marketingLabel: 'Marketing',
    marketingDescription: 'Used to deliver relevant advertisements and track campaign effectiveness.',
    personalizationLabel: 'Personalization',
    personalizationDescription: 'Remember your preferences and customize your experience.',
    // Expandable layout labels
    expandableHowWeUseLabel: 'How we use cookies',
    expandableHowWeUseDescription: 'We use cookies to improve your experience on our website, analyze traffic, and personalize content.',
    expandableNecessaryLabel: 'We use necessary cookies',
    expandableNecessaryDescription: 'These cookies are essential for the website to function properly and cannot be disabled.',
    expandableAnalyticsLabel: 'Accept analytical cookies',
    expandableMarketingLabel: 'Accept marketing cookies',
    expandablePersonalizationLabel: 'Accept personalization cookies',
    // Styling
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    primaryButtonBg: '#10b981',
    primaryButtonText: '#ffffff',
    primaryButtonHover: '#059669',
    secondaryButtonBg: '#f3f4f6',
    secondaryButtonText: '#374151',
    secondaryButtonHover: '#e5e7eb',
    borderColor: '#e5e7eb',
    toggleOnColor: '#10b981',
    toggleOffColor: '#d1d5db',
    linkColor: '#3b82f6',
    borderRadius: '12px',
    boxShadow: 'lg',
    bannerShape: 'rounded',
  },
  watch: {
    'content.isOpen': {
      handler(newValue) {
        // Only apply when isOpen is explicitly set (not null/undefined)
        if (newValue !== null && newValue !== undefined) {
          if (newValue) {
            this.showBannerState = true;
            this.showPreferencesState = false;
            this.$emit('trigger-event', { name: 'bannerShown', event: { source: 'controller' } });
          } else {
            this.showBannerState = false;
            this.$emit('trigger-event', { name: 'bannerHidden', event: { reason: 'controller' } });
          }
        }
      },
      immediate: false,
    },
  },
  mounted() {
    this.checkExistingConsent();
    this.fetchIpData();
  },
  methods: {
    // ═══════════════════════════════════════════════════════════════
    // IP ADDRESS COLLECTION
    // ═══════════════════════════════════════════════════════════════
    async fetchIpData() {
      if (!this.content.collectIpAddress) {
        this.ipData = null;
        return;
      }

      try {
        // Using ipapi.co - free tier allows 1000 requests/day
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.ipData = {
            ip: data.ip || null,
            city: data.city || null,
            region: data.region || null,
            regionCode: data.region_code || null,
            country: data.country_name || null,
            countryCode: data.country_code || null,
            continent: data.continent_code || null,
            postal: data.postal || null,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            timezone: data.timezone || null,
            utcOffset: data.utc_offset || null,
            org: data.org || null,
            asn: data.asn || null,
            currency: data.currency || null,
          };
        }
      } catch (e) {
        console.warn('Failed to fetch IP data:', e);
        this.ipData = null;
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // BROWSER DATA COLLECTION (LGPD/GDPR Compliant)
    // ═══════════════════════════════════════════════════════════════
    collectBrowserData() {
      try {
        return {
          userAgent: navigator.userAgent || '',
          language: navigator.language || '',
          languages: navigator.languages ? [...navigator.languages] : [],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
          timezoneOffset: new Date().getTimezoneOffset(),
          screenSize: `${screen.width || 0}x${screen.height || 0}`,
          viewportSize: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
          colorDepth: screen.colorDepth || 0,
          pixelRatio: window.devicePixelRatio || 1,
          cookieEnabled: navigator.cookieEnabled || false,
          doNotTrack: navigator.doNotTrack || 'unspecified',
          online: navigator.onLine !== undefined ? navigator.onLine : true,
          platform: navigator.platform || '',
          vendor: navigator.vendor || '',
          touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
          maxTouchPoints: navigator.maxTouchPoints || 0,
        };
      } catch (e) {
        console.warn('Failed to collect browser data:', e);
        return {};
      }
    },

    collectPageContext() {
      try {
        return {
          url: window.location.href || '',
          hostname: window.location.hostname || '',
          pathname: window.location.pathname || '',
          referrer: document.referrer || '',
          title: document.title || '',
        };
      } catch (e) {
        console.warn('Failed to collect page context:', e);
        return {};
      }
    },

    collectSourceData(method, buttonClicked) {
      const interactionTimeMs = this.bannerDisplayTime
        ? Date.now() - this.bannerDisplayTime
        : null;

      return {
        method,
        style: this.content.bannerStyle || 'standard',
        layout: this.content.bannerLayout || 'card',
        position: this.content.position || 'bottom-left',
        buttonClicked,
        interactionTimeMs,
      };
    },

    // ═══════════════════════════════════════════════════════════════
    // STORAGE METHODS
    // ═══════════════════════════════════════════════════════════════
    // ═══════════════════════════════════════════════════════════════
    // UUID GENERATION (PRD-2 Epic E)
    // ═══════════════════════════════════════════════════════════════
    generateUUID() {
      // Use crypto.randomUUID when available (modern browsers)
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      // Fallback for older browsers
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    generateConsentId() {
      return `cc_${this.generateUUID()}`;
    },

    getStoredConsent() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const consent = JSON.parse(stored);
          // Check if expired
          if (consent.expiration && new Date(consent.expiration) < new Date()) {
            this.clearConsent();
            return null;
          }
          return consent;
        }
      } catch (e) {
        console.warn('Failed to read consent from localStorage:', e);
      }
      return null;
    },

    saveConsent(categories, action = 'custom', sourceMethod = 'banner') {
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(expiration.getDate() + (this.content.cookieExpiration || 365));

      const consentData = {
        version: '1.2',
        consentId: this.generateConsentId(),
        timestamp: now.toISOString(),
        mode: this.content.consentMode,
        action,
        categories: {
          essential: true,
          analytics: categories.analytics || false,
          marketing: categories.marketing || false,
          personalization: categories.personalization || false,
        },
        expiration: expiration.toISOString(),
        // Extended data collection
        browser: this.collectBrowserData(),
        page: this.collectPageContext(),
        source: this.collectSourceData(sourceMethod, action),
        // IP and geolocation data (if enabled and available)
        ip: this.ipData,
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
      } catch (e) {
        console.warn('Failed to save consent to localStorage:', e);
      }

      // Set cookie with consent data (PRD-2 Epic D)
      if (this.content.storageCookieEnabled !== false) {
        this.setConsentCookie(consentData);
      }

      return consentData;
    },

    // ═══════════════════════════════════════════════════════════════
    // CROSS-SUBDOMAIN COOKIE (PRD-2 Epic D)
    // ═══════════════════════════════════════════════════════════════
    setConsentCookie(consentData) {
      const maxAge = (this.content.cookieExpiration || 365) * 24 * 60 * 60;

      // Store minimal consent data in cookie for cross-subdomain sync
      const cookieValue = JSON.stringify({
        v: consentData.version,
        c: consentData.categories,
        t: consentData.timestamp,
        id: consentData.consentId,
      });

      // Build cookie string
      let cookieStr = `${COOKIE_NAME}=${encodeURIComponent(cookieValue)}; max-age=${maxAge}; path=/; SameSite=Lax`;

      // Add domain if configured (for cross-subdomain)
      const domain = this.content.storageCookieDomain;
      if (domain && domain.trim()) {
        cookieStr += `; domain=${domain.trim()}`;
      }

      // Add Secure flag if on HTTPS
      if (window.location.protocol === 'https:') {
        cookieStr += '; Secure';
      }

      document.cookie = cookieStr;
    },

    getConsentCookie() {
      try {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === COOKIE_NAME && value) {
            const decoded = decodeURIComponent(value);
            // Check if it's JSON (new format) or just "1" (old format)
            if (decoded === '1') {
              // Legacy cookie - return null to show banner
              return { legacy: true };
            }
            return JSON.parse(decoded);
          }
        }
      } catch (e) {
        console.warn('Failed to read consent cookie:', e);
      }
      return null;
    },

    hydrateFromCookie() {
      const cookieData = this.getConsentCookie();

      if (!cookieData) return null;

      // Handle legacy cookie format
      if (cookieData.legacy) {
        // Old format - consent exists but no categories
        // Return null to show banner for re-consent
        return null;
      }

      // Hydrate localStorage from cookie data
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(expiration.getDate() + (this.content.cookieExpiration || 365));

      const hydratedConsent = {
        version: cookieData.v || '1.2',
        consentId: cookieData.id || this.generateConsentId(),
        timestamp: cookieData.t || now.toISOString(),
        mode: this.content.consentMode,
        action: 'hydrated',
        categories: cookieData.c || {
          essential: true,
          analytics: false,
          marketing: false,
          personalization: false,
        },
        expiration: expiration.toISOString(),
        browser: this.collectBrowserData(),
        page: this.collectPageContext(),
        source: { method: 'cookie-hydration' },
        ip: this.ipData,
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hydratedConsent));
      } catch (e) {
        console.warn('Failed to hydrate localStorage from cookie:', e);
      }

      return hydratedConsent;
    },

    clearConsent() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear consent from localStorage:', e);
      }

      // Clear cookie with domain if configured
      let cookieStr = `${COOKIE_NAME}=; max-age=0; path=/`;
      const domain = this.content.storageCookieDomain;
      if (domain && domain.trim()) {
        cookieStr += `; domain=${domain.trim()}`;
      }
      document.cookie = cookieStr;
    },

    // ═══════════════════════════════════════════════════════════════
    // GOOGLE CONSENT MODE V2 (PRD-2 Epic B)
    // ═══════════════════════════════════════════════════════════════
    initGoogleConsentDefault() {
      if (!this.content.googleConsentModeEnabled) return;
      if (!this.content.googleConsentDefaultDenied) return;

      // Check if gtag exists
      if (typeof window.gtag !== 'function') {
        // Create gtag function if it doesn't exist (for dataLayer)
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
      }

      // Set default denied state for all signals
      window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500, // Wait 500ms for consent update
      });
    },

    updateGoogleConsentMode(categories) {
      if (!this.content.googleConsentModeEnabled) return;

      // Check if gtag exists
      if (typeof window.gtag !== 'function') return;

      const consentUpdate = {
        analytics_storage: categories.analytics ? 'granted' : 'denied',
      };

      // Map marketing category to ad signals if enabled
      if (this.content.googleConsentMapMarketing !== false) {
        const marketingStatus = categories.marketing ? 'granted' : 'denied';
        consentUpdate.ad_storage = marketingStatus;
        consentUpdate.ad_user_data = marketingStatus;
        consentUpdate.ad_personalization = marketingStatus;
      }

      window.gtag('consent', 'update', consentUpdate);
    },

    // ═══════════════════════════════════════════════════════════════
    // META PIXEL CONSENT (PRD-2 Epic C)
    // ═══════════════════════════════════════════════════════════════
    updateMetaPixelConsent(categories) {
      if (!this.content.metaPixelEnabled) return;

      // Safe check for fbq existence
      if (typeof window.fbq !== 'function') return;

      try {
        if (categories.marketing) {
          window.fbq('consent', 'grant');
        } else {
          window.fbq('consent', 'revoke');
        }
      } catch (e) {
        console.warn('Failed to update Meta Pixel consent:', e);
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // CONSENT DEFAULTED EVENT (PRD-2 Epic A)
    // ═══════════════════════════════════════════════════════════════
    emitConsentDefaulted() {
      if (!this.content.emitDefaultStateEvent) return;

      this.$emit('trigger-event', {
        name: 'consentDefaulted',
        event: {
          hasConsent: false,
          effectiveConsent: {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          },
          timestamp: new Date().toISOString(),
        },
      });
    },

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    checkExistingConsent() {
      // Initialize Google Consent Mode default (must be early)
      this.initGoogleConsentDefault();

      // Try to get consent from localStorage first
      let consent = this.getStoredConsent();

      // If no localStorage, try to hydrate from cookie (cross-subdomain)
      if (!consent && this.content.storageCookieEnabled !== false) {
        consent = this.hydrateFromCookie();
      }

      if (consent) {
        this.consentGiven = true;
        this.tempPreferences = {
          analytics: consent.categories?.analytics || false,
          marketing: consent.categories?.marketing || false,
          personalization: consent.categories?.personalization || false,
        };
        this.showBannerState = false;

        // Apply consent to Google Consent Mode and Meta Pixel
        this.updateGoogleConsentMode(consent.categories);
        this.updateMetaPixelConsent(consent.categories);

        // Enable scripts for granted categories
        this.enableScripts(consent.categories);
      } else {
        this.consentGiven = false;
        // Emit consent defaulted event
        this.emitConsentDefaulted();

        // Show banner based on consent mode
        if (this.content.consentMode !== 'informational') {
          this.showBannerState = true;
          this.bannerDisplayTime = Date.now(); // Start tracking interaction time
          this.$emit('trigger-event', { name: 'bannerShown', event: {} });
        }
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════
    // Helper to ensure IP data has consistent structure
    getIpDataForEvent() {
      const emptyIp = {
        ip: '',
        city: '',
        region: '',
        regionCode: '',
        country: '',
        countryCode: '',
        continent: '',
        postal: '',
        latitude: null,
        longitude: null,
        timezone: '',
        utcOffset: '',
        org: '',
        asn: '',
        currency: '',
      };
      return this.ipData ? { ...emptyIp, ...this.ipData } : emptyIp;
    },

    handleAcceptAll(fromPreferences = false) {
      const categories = {
        analytics: this.content.analyticsEnabled,
        marketing: this.content.marketingEnabled,
        personalization: this.content.personalizationEnabled,
      };

      const sourceMethod = fromPreferences ? 'preferences' : 'banner';
      const consentData = this.saveConsent(categories, 'acceptAll', sourceMethod);
      this.consentGiven = true;
      this.tempPreferences = { ...categories };
      this.showBannerState = false;
      this.showPreferencesState = false;

      // Build event data with consistent structure for WeWeb
      const eventData = {
        consentId: consentData.consentId || '',
        categories: consentData.categories || { essential: true, analytics: false, marketing: false, personalization: false },
        timestamp: consentData.timestamp || '',
        browser: consentData.browser || {},
        page: consentData.page || {},
        source: consentData.source || {},
        ip: this.getIpDataForEvent(),
      };

      // Store internally for later retrieval
      this.lastConsentData = eventData;

      // Update bindable property for WeWeb bindings
      this.$emit('update', { lastConsentData: eventData });

      this.$emit('trigger-event', {
        name: 'consentGiven',
        event: eventData,
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'acceptAll' },
      });

      // Reset interaction time
      this.bannerDisplayTime = null;

      // Update Google Consent Mode and Meta Pixel
      this.updateGoogleConsentMode(categories);
      this.updateMetaPixelConsent(categories);

      this.enableScripts(categories);
    },

    handleDeclineAll(fromPreferences = false) {
      const categories = {
        analytics: false,
        marketing: false,
        personalization: false,
      };

      const sourceMethod = fromPreferences ? 'preferences' : 'banner';
      const consentData = this.saveConsent(categories, 'declineAll', sourceMethod);
      this.consentGiven = true;
      this.tempPreferences = { ...categories };
      this.showBannerState = false;
      this.showPreferencesState = false;

      // Build event data with consistent structure for WeWeb
      const eventData = {
        consentId: consentData.consentId || '',
        categories: consentData.categories || { essential: true, analytics: false, marketing: false, personalization: false },
        timestamp: consentData.timestamp || '',
        browser: consentData.browser || {},
        page: consentData.page || {},
        source: consentData.source || {},
        ip: this.getIpDataForEvent(),
      };

      // Store internally for later retrieval
      this.lastConsentData = eventData;

      // Update bindable property for WeWeb bindings
      this.$emit('update', { lastConsentData: eventData });

      this.$emit('trigger-event', {
        name: 'consentDeclined',
        event: eventData,
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'declineAll' },
      });

      // Reset interaction time
      this.bannerDisplayTime = null;

      // Update Google Consent Mode and Meta Pixel
      this.updateGoogleConsentMode(categories);
      this.updateMetaPixelConsent(categories);
    },

    handleOpenPreferences() {
      this.showPreferencesState = true;
      this.showBannerState = false;

      this.$emit('trigger-event', { name: 'preferencesOpened', event: {} });
    },

    handleClosePreferences() {
      this.showPreferencesState = false;

      // If no consent given yet, show banner again
      if (!this.consentGiven) {
        this.showBannerState = true;
      }

      this.$emit('trigger-event', { name: 'preferencesClosed', event: {} });
    },

    handleUpdatePreference(category, value) {
      this.tempPreferences[category] = value;
    },

    handleSavePreferences() {
      const consentData = this.saveConsent(this.tempPreferences, 'savePreferences', 'preferences');
      this.consentGiven = true;
      this.showPreferencesState = false;
      this.showBannerState = false;

      // Build event data with consistent structure for WeWeb
      const eventData = {
        consentId: consentData.consentId || '',
        categories: consentData.categories || { essential: true, analytics: false, marketing: false, personalization: false },
        timestamp: consentData.timestamp || '',
        browser: consentData.browser || {},
        page: consentData.page || {},
        source: consentData.source || {},
        ip: this.getIpDataForEvent(),
      };

      // Store internally for later retrieval
      this.lastConsentData = eventData;

      // Update bindable property for WeWeb bindings
      this.$emit('update', { lastConsentData: eventData });

      this.$emit('trigger-event', {
        name: 'preferencesUpdated',
        event: eventData,
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'savePreferences' },
      });

      // Reset interaction time
      this.bannerDisplayTime = null;

      // Update Google Consent Mode and Meta Pixel
      this.updateGoogleConsentMode(this.tempPreferences);
      this.updateMetaPixelConsent(this.tempPreferences);

      this.enableScripts(this.tempPreferences);
    },

    // ═══════════════════════════════════════════════════════════════
    // SCRIPT GATING
    // ═══════════════════════════════════════════════════════════════
    enableScripts(categories) {
      const categoryList = ['analytics', 'marketing', 'personalization'];

      categoryList.forEach((category) => {
        if (categories[category]) {
          const scripts = document.querySelectorAll(
            `script[data-cc-category="${category}"][type="text/plain"]`
          );

          scripts.forEach((script) => {
            const newScript = document.createElement('script');

            // Copy attributes
            Array.from(script.attributes).forEach((attr) => {
              if (attr.name !== 'type') {
                newScript.setAttribute(attr.name, attr.value);
              }
            });

            newScript.type = 'text/javascript';

            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.textContent = script.textContent;
            }

            script.parentNode.replaceChild(newScript, script);
          });
        }
      });
    },

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC ACTIONS (Called from WeWeb Workflows)
    // ═══════════════════════════════════════════════════════════════
    showBanner() {
      this.showBannerState = true;
      this.showPreferencesState = false;
      this.bannerDisplayTime = Date.now(); // Start tracking interaction time
      this.$emit('trigger-event', { name: 'bannerShown', event: {} });
    },

    hideBanner() {
      this.showBannerState = false;
      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'manual' },
      });
    },

    openPreferences() {
      this.handleOpenPreferences();
    },

    closePreferences() {
      this.handleClosePreferences();
    },

    acceptAll() {
      this.handleAcceptAll();
    },

    declineAll() {
      this.handleDeclineAll();
    },

    savePreferences(categories) {
      if (categories && typeof categories === 'object') {
        this.tempPreferences = {
          analytics: categories.analytics || false,
          marketing: categories.marketing || false,
          personalization: categories.personalization || false,
        };
      }
      this.handleSavePreferences();
    },

    resetConsent() {
      this.clearConsent();
      this.consentGiven = false;
      this.tempPreferences = {
        analytics: false,
        marketing: false,
        personalization: false,
      };
      this.showBannerState = true;
      this.bannerDisplayTime = Date.now(); // Start tracking interaction time
      this.$emit('trigger-event', { name: 'bannerShown', event: {} });
    },

    getConsentStatus() {
      const consent = this.getStoredConsent();
      this.$emit('trigger-event', {
        name: 'consentStatusRetrieved',
        event: {
          hasConsent: !!consent,
          consent: consent || {},
        },
      });
      return consent;
    },

    getLastConsent() {
      const data = this.lastConsentData || this.getStoredConsent();

      // Build consistent event data
      const eventData = data ? {
        consentId: data.consentId || '',
        categories: data.categories || { essential: true, analytics: false, marketing: false, personalization: false },
        timestamp: data.timestamp || '',
        browser: data.browser || {},
        page: data.page || {},
        source: data.source || {},
        ip: data.ip || this.getIpDataForEvent(),
      } : {};

      this.$emit('trigger-event', {
        name: 'lastConsentRetrieved',
        event: eventData,
      });

      return data;
    },

    // ═══════════════════════════════════════════════════════════════
    // NEW ACTION: setConsent (PRD-2 Epic F)
    // ═══════════════════════════════════════════════════════════════
    setConsent(categories, options = {}) {
      // Get previous categories for consentChanged event
      const previousConsent = this.getStoredConsent();
      const previousCategories = previousConsent?.categories || {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false,
      };

      // Normalize categories
      const normalizedCategories = {
        analytics: categories?.analytics || false,
        marketing: categories?.marketing || false,
        personalization: categories?.personalization || false,
      };

      // Save consent
      const sourceMethod = options?.source || 'setConsent';
      const consentData = this.saveConsent(normalizedCategories, 'setConsent', sourceMethod);

      this.consentGiven = true;
      this.tempPreferences = { ...normalizedCategories };
      this.showBannerState = false;
      this.showPreferencesState = false;

      // Build event data
      const eventData = {
        consentId: consentData.consentId || '',
        categories: consentData.categories || { essential: true, analytics: false, marketing: false, personalization: false },
        timestamp: consentData.timestamp || '',
        browser: consentData.browser || {},
        page: consentData.page || {},
        source: consentData.source || {},
        ip: this.getIpDataForEvent(),
      };

      // Store internally
      this.lastConsentData = eventData;

      // Update bindable property
      this.$emit('update', { lastConsentData: eventData });

      // Emit consentChanged event (new in PRD-2)
      this.$emit('trigger-event', {
        name: 'consentChanged',
        event: {
          consentId: consentData.consentId,
          categories: consentData.categories,
          previousCategories,
          timestamp: consentData.timestamp,
          source: sourceMethod,
        },
      });

      // Emit appropriate consent event based on categories
      const allAccepted = normalizedCategories.analytics &&
        normalizedCategories.marketing &&
        normalizedCategories.personalization;
      const allDeclined = !normalizedCategories.analytics &&
        !normalizedCategories.marketing &&
        !normalizedCategories.personalization;

      if (allAccepted) {
        this.$emit('trigger-event', { name: 'consentGiven', event: eventData });
      } else if (allDeclined) {
        this.$emit('trigger-event', { name: 'consentDeclined', event: eventData });
      } else {
        this.$emit('trigger-event', { name: 'preferencesUpdated', event: eventData });
      }

      // Update Google Consent Mode and Meta Pixel
      this.updateGoogleConsentMode(normalizedCategories);
      this.updateMetaPixelConsent(normalizedCategories);

      // Enable scripts
      this.enableScripts(normalizedCategories);

      return consentData;
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-host {
  display: inline-block;
  min-width: 100px;
  min-height: 50px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &.cc-host-fullwidth {
    display: block;
    width: 100%;
    min-width: 100%;
  }
}

.cc-editor-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 32px;
  background: #f3f4f6;
  border: 2px dashed #9ca3af;
  border-radius: 8px;
  color: #6b7280;
  min-width: 220px;

  svg {
    color: #9ca3af;
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  small {
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
  }
}
</style>
