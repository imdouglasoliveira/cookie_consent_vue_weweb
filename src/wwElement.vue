<template>
  <div class="cc-host" :style="cssVars">
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
    };
  },
  computed: {
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
  },
  mounted() {
    this.checkExistingConsent();
  },
  methods: {
    // ═══════════════════════════════════════════════════════════════
    // STORAGE METHODS
    // ═══════════════════════════════════════════════════════════════
    generateConsentId() {
      return `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

    saveConsent(categories, action = 'custom') {
      const now = new Date();
      const expiration = new Date(now);
      expiration.setDate(expiration.getDate() + (this.content.cookieExpiration || 365));

      const consentData = {
        version: '1.0',
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
      };

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
      } catch (e) {
        console.warn('Failed to save consent to localStorage:', e);
      }

      // Set fallback cookie
      const maxAge = (this.content.cookieExpiration || 365) * 24 * 60 * 60;
      document.cookie = `${COOKIE_NAME}=1; max-age=${maxAge}; path=/; SameSite=Lax`;

      return consentData;
    },

    clearConsent() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear consent from localStorage:', e);
      }
      document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
    },

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    checkExistingConsent() {
      const consent = this.getStoredConsent();

      if (consent) {
        this.consentGiven = true;
        this.tempPreferences = {
          analytics: consent.categories?.analytics || false,
          marketing: consent.categories?.marketing || false,
          personalization: consent.categories?.personalization || false,
        };
        this.showBannerState = false;
      } else {
        this.consentGiven = false;
        // Show banner based on consent mode
        if (this.content.consentMode !== 'informational') {
          this.showBannerState = true;
          this.$emit('trigger-event', { name: 'bannerShown', event: {} });
        }
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════
    handleAcceptAll() {
      const categories = {
        analytics: this.content.analyticsEnabled,
        marketing: this.content.marketingEnabled,
        personalization: this.content.personalizationEnabled,
      };

      const consentData = this.saveConsent(categories, 'acceptAll');
      this.consentGiven = true;
      this.tempPreferences = { ...categories };
      this.showBannerState = false;
      this.showPreferencesState = false;

      this.$emit('trigger-event', {
        name: 'consentGiven',
        event: {
          consentId: consentData.consentId,
          categories: consentData.categories,
          timestamp: consentData.timestamp,
        },
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'acceptAll' },
      });

      this.enableScripts(categories);
    },

    handleDeclineAll() {
      const categories = {
        analytics: false,
        marketing: false,
        personalization: false,
      };

      const consentData = this.saveConsent(categories, 'declineAll');
      this.consentGiven = true;
      this.tempPreferences = { ...categories };
      this.showBannerState = false;
      this.showPreferencesState = false;

      this.$emit('trigger-event', {
        name: 'consentDeclined',
        event: {
          consentId: consentData.consentId,
          timestamp: consentData.timestamp,
        },
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'declineAll' },
      });
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
      const consentData = this.saveConsent(this.tempPreferences, 'savePreferences');
      this.consentGiven = true;
      this.showPreferencesState = false;
      this.showBannerState = false;

      this.$emit('trigger-event', {
        name: 'preferencesUpdated',
        event: {
          consentId: consentData.consentId,
          categories: consentData.categories,
          timestamp: consentData.timestamp,
        },
      });

      this.$emit('trigger-event', {
        name: 'bannerHidden',
        event: { reason: 'savePreferences' },
      });

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
  },
};
</script>

<style lang="scss" scoped>
.cc-host {
  display: inline-block;
  min-width: 100px;
  min-height: 50px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
