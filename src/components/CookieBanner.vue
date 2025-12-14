<template>
  <div
    class="cc-banner-container"
    :class="[positionClass, layoutClass, shapeClass, drawerSideClass]"
    :style="containerStyle"
  >
    <!-- Modal Overlay (only for modal layout) -->
    <div
      v-if="content.bannerLayout === 'modal'"
      class="cc-modal-overlay"
      @click="handleOverlayClick"
    ></div>

    <!-- Drawer Overlay -->
    <div
      v-if="content.bannerLayout === 'drawer' && content.drawerOverlay"
      class="cc-drawer-overlay"
      @click="handleOverlayClick"
    ></div>

    <div
      class="cc-banner"
      :class="[styleClass, layoutClass, buttonLayoutClass]"
      :style="bannerStyle"
      data-cc="banner"
    >
      <!-- Close Button (X) -->
      <button
        v-if="content.showCloseButton"
        class="cc-close-btn"
        data-cc="close"
        aria-label="Close"
        @click="$emit('decline-all')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>

      <!-- Cookie Icon -->
      <div v-if="content.showCookieIcon" class="cc-banner-icon">
        <!-- Default Cookie -->
        <svg v-if="content.iconStyle === 'default'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
          <path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/>
        </svg>
        <!-- Shield -->
        <svg v-else-if="content.iconStyle === 'shield'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <!-- Lock -->
        <svg v-else-if="content.iconStyle === 'lock'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <!-- Settings -->
        <svg v-else-if="content.iconStyle === 'settings'" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>

      <!-- Content -->
      <div class="cc-banner-content">
        <!-- Title (hidden in minimal style) -->
        <h3 v-if="content.bannerStyle !== 'minimal'" class="cc-banner-title">
          {{ content.bannerTitle }}
        </h3>

        <!-- Message -->
        <p class="cc-banner-message">
          {{ content.bannerMessage }}
          <a
            v-if="content.showPolicyLink"
            :href="content.policyPageUrl"
            class="cc-policy-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ content.policyLinkLabel }}
          </a>
        </p>

        <!-- Detailed Style: Show toggles inline -->
        <div v-if="content.bannerStyle === 'detailed'" class="cc-banner-categories">
          <CategoryToggle
            v-if="content.analyticsEnabled"
            :label="content.analyticsLabel"
            :description="content.analyticsDescription"
            :checked="tempPreferences.analytics"
            :disabled="false"
            compact
            @change="(val) => $emit('update-preference', 'analytics', val)"
          />
          <CategoryToggle
            v-if="content.marketingEnabled"
            :label="content.marketingLabel"
            :description="content.marketingDescription"
            :checked="tempPreferences.marketing"
            :disabled="false"
            compact
            @change="(val) => $emit('update-preference', 'marketing', val)"
          />
          <CategoryToggle
            v-if="content.personalizationEnabled"
            :label="content.personalizationLabel"
            :description="content.personalizationDescription"
            :checked="tempPreferences.personalization"
            :disabled="false"
            compact
            @change="(val) => $emit('update-preference', 'personalization', val)"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="cc-banner-actions" :class="buttonLayoutClass">
        <!-- Preferences button -->
        <button
          v-if="content.showPreferencesButton && content.bannerStyle !== 'minimal' && content.consentMode !== 'informational'"
          class="cc-btn cc-btn-link"
          data-cc="open-preferences"
          @click="$emit('open-preferences')"
        >
          {{ content.preferencesLabel }}
        </button>

        <!-- Decline button -->
        <button
          v-if="content.showDeclineButton && content.consentMode !== 'informational'"
          class="cc-btn cc-btn-secondary"
          data-cc="deny"
          @click="$emit('decline-all')"
        >
          {{ content.declineAllLabel }}
        </button>

        <!-- Accept button -->
        <button
          class="cc-btn cc-btn-primary"
          data-cc="allow"
          @click="$emit('accept-all')"
        >
          {{ content.acceptAllLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryToggle from './CategoryToggle.vue';

export default {
  name: 'CookieBanner',
  components: {
    CategoryToggle,
  },
  props: {
    content: { type: Object, required: true },
    tempPreferences: { type: Object, required: true },
  },
  emits: ['accept-all', 'decline-all', 'open-preferences', 'update-preference'],
  computed: {
    positionClass() {
      if (this.content.bannerLayout === 'modal') {
        return 'cc-position-center';
      }
      if (this.content.bannerLayout === 'bar') {
        return this.content.position?.includes('top') ? 'cc-position-top' : 'cc-position-bottom';
      }
      return `cc-position-${this.content.position || 'bottom-left'}`;
    },
    layoutClass() {
      return `cc-layout-${this.content.bannerLayout || 'card'}`;
    },
    styleClass() {
      return `cc-style-${this.content.bannerStyle || 'standard'}`;
    },
    buttonLayoutClass() {
      return `cc-buttons-${this.content.buttonLayout || 'horizontal'}`;
    },
    shapeClass() {
      const shape = this.content.bannerShape || 'rounded';
      return shape !== 'rounded' ? `cc-shape-${shape}` : '';
    },
    drawerSideClass() {
      if (this.content.bannerLayout !== 'drawer') return '';
      return `cc-drawer-${this.content.drawerSide || 'right'}`;
    },
    containerStyle() {
      return {};
    },
    bannerStyle() {
      const width = this.content.bannerWidth || '480';
      if (this.content.bannerLayout === 'bar') {
        return {};
      }
      if (width === 'auto') {
        return {};
      }
      return {
        maxWidth: `${width}px`,
      };
    },
  },
  methods: {
    handleOverlayClick() {
      if (this.content.consentMode === 'informational') {
        this.$emit('accept-all');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-banner-container {
  position: fixed;
  z-index: 9999;
  padding: 16px;
  pointer-events: none;

  // ═══════════════════════════════════════════════════════════════
  // POSITION CLASSES
  // ═══════════════════════════════════════════════════════════════
  &.cc-position-bottom-left {
    bottom: 0;
    left: 0;
  }

  &.cc-position-bottom-right {
    bottom: 0;
    right: 0;
  }

  &.cc-position-bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.cc-position-top-left {
    top: 0;
    left: 0;
  }

  &.cc-position-top-right {
    top: 0;
    right: 0;
  }

  &.cc-position-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &.cc-position-center {
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  &.cc-position-top,
  &.cc-position-bottom {
    left: 0;
    right: 0;
    padding: 0;
  }

  &.cc-position-top {
    top: 0;
  }

  &.cc-position-bottom {
    bottom: 0;
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: BAR (Full Width)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-bar {
    .cc-banner {
      max-width: 100%;
      border-radius: 0;
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px 24px;

      .cc-banner-icon {
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .cc-banner-content {
        flex: 1;
        text-align: left;

        .cc-banner-title {
          font-size: 16px;
          margin-bottom: 4px;
        }

        .cc-banner-message {
          margin: 0;
          font-size: 14px;
        }

        // Detailed style: horizontal toggles in bar layout
        .cc-banner-categories {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 16px;
          margin: 12px 0 0 0;
          padding: 0;
          background: transparent;
          border-radius: 0;
        }
      }

      .cc-banner-actions {
        flex-shrink: 0;
        margin: 0;
      }

      // When detailed style, adjust layout for two rows
      &.cc-style-detailed {
        flex-wrap: wrap;

        .cc-banner-content {
          flex: 1 1 100%;
          display: flex;
          align-items: center;
          gap: 16px;

          .cc-banner-title {
            display: none;
          }

          .cc-banner-message {
            flex: 1;
          }

          .cc-banner-categories {
            flex: 0 0 auto;
          }
        }

        .cc-banner-actions {
          flex: 0 0 auto;
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: POPUP (Compact)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-popup {
    .cc-banner {
      padding: 16px 20px;

      .cc-banner-icon svg {
        width: 24px;
        height: 24px;
      }

      .cc-banner-title {
        font-size: 15px;
      }

      .cc-banner-message {
        font-size: 13px;
      }

      .cc-btn {
        padding: 8px 16px;
        font-size: 13px;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: MODAL (Centered with overlay)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-modal {
    .cc-banner {
      position: relative;
      z-index: 10001;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: TOAST (Snackbar / Pill)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-toast {
    .cc-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      max-width: 600px;

      .cc-banner-icon {
        margin: 0;
        flex-shrink: 0;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .cc-banner-content {
        flex: 1;
        min-width: 0;
        text-align: left;
      }

      .cc-banner-title {
        display: none;
      }

      .cc-banner-message {
        margin: 0;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 480px) {
          white-space: normal;
        }
      }

      .cc-banner-categories {
        display: none;
      }

      .cc-banner-actions {
        flex-shrink: 0;
        gap: 8px;
        margin: 0;

        .cc-btn {
          padding: 8px 16px;
          font-size: 13px;
        }
      }

      .cc-close-btn {
        position: static;
        order: 99;
        margin-left: 4px;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: BANNER (Inline, non-fixed)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-banner {
    position: relative !important;
    width: 100%;
    padding: 0;

    .cc-banner {
      max-width: 100% !important;
      width: 100%;
      border-radius: 0 !important;
      box-shadow: none !important;
      border-left: none;
      border-right: none;
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 24px;
      padding: 12px 24px;

      .cc-banner-icon {
        margin: 0 !important;
        flex-shrink: 0;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      .cc-banner-content {
        flex: 1;
        text-align: left !important;

        .cc-banner-title {
          display: none !important;
        }

        .cc-banner-message {
          margin: 0 !important;
          font-size: 14px;
          display: inline;
        }

        .cc-banner-categories {
          display: none !important;
        }
      }

      .cc-banner-actions {
        flex-shrink: 0;
        margin: 0 !important;
        flex-direction: row !important;
      }

      .cc-close-btn {
        position: static;
        order: 99;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: FLOATING (Corner Card)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-floating {
    .cc-banner {
      max-width: 300px;
      padding: 20px;
      text-align: center;

      .cc-banner-icon {
        margin-bottom: 12px;

        svg {
          width: 40px;
          height: 40px;
        }
      }

      .cc-banner-content {
        text-align: center;
      }

      .cc-banner-title {
        font-size: 16px;
        margin-bottom: 8px;
      }

      .cc-banner-message {
        font-size: 13px;
        line-height: 1.5;
      }

      .cc-banner-categories {
        display: none;
      }

      .cc-banner-actions {
        flex-direction: column;
        width: 100%;
        margin-top: 16px;

        .cc-btn {
          width: 100%;
        }

        .cc-btn-link {
          order: 99;
          font-size: 13px;
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT: DRAWER (Side Panel)
  // ═══════════════════════════════════════════════════════════════
  &.cc-layout-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 360px;
    max-width: 90vw;
    z-index: 10001;
    padding: 0;

    &.cc-drawer-left {
      left: 0;
      right: auto;
    }

    &.cc-drawer-right {
      right: 0;
      left: auto;
    }

    .cc-banner {
      height: 100%;
      max-width: 100%;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 24px;

      .cc-banner-icon {
        margin-bottom: 16px;

        svg {
          width: 32px;
          height: 32px;
        }
      }

      .cc-banner-content {
        flex: 1;
        text-align: left;
        overflow-y: auto;

        .cc-banner-title {
          font-size: 20px;
          margin-bottom: 12px;
        }

        .cc-banner-message {
          margin-bottom: 20px;
        }

        .cc-banner-categories {
          margin: 20px 0;
          padding: 16px;
        }
      }

      .cc-banner-actions {
        flex-direction: column;
        padding-top: 16px;
        border-top: 1px solid var(--cc-border, #e5e7eb);
        margin-top: auto;
        gap: 10px;

        .cc-btn {
          width: 100%;
        }
      }

      .cc-close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // MOBILE RESPONSIVE
  // ═══════════════════════════════════════════════════════════════
  @media (max-width: 768px) {
    &:not(.cc-layout-bar):not(.cc-layout-modal) {
      left: 0 !important;
      right: 0 !important;
      transform: none !important;
      padding: 12px;
    }

    &.cc-layout-bar .cc-banner {
      flex-direction: column;
      text-align: center;
      gap: 12px;

      .cc-banner-content {
        text-align: center;
      }
    }
  }
}

.cc-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  pointer-events: auto;
  animation: cc-fade-in 0.2s ease-out;
}

@keyframes cc-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cc-banner {
  position: relative;
  background: var(--cc-bg, #ffffff);
  color: var(--cc-text, #1f2937);
  border: 1px solid var(--cc-border, #e5e7eb);
  border-radius: var(--cc-radius, 12px);
  box-shadow: var(--cc-shadow);
  padding: 20px 24px;
  max-width: 480px;
  pointer-events: auto;
  animation: cc-slide-in 0.3s ease-out;

  &.cc-style-minimal {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 600px;
    padding: 16px 20px;

    .cc-banner-content {
      flex: 1;
    }

    .cc-banner-message {
      margin: 0;
    }

    .cc-banner-actions {
      flex-shrink: 0;
      margin: 0;
    }
  }

  &.cc-style-detailed {
    max-width: 520px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: var(--cc-radius, 12px) var(--cc-radius, 12px) 0 0;

    &.cc-style-minimal {
      flex-direction: column;
      align-items: stretch;
    }
  }
}

@keyframes cc-slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cc-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--cc-text-secondary, #6b7280);
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: var(--cc-secondary-bg, #f3f4f6);
    color: var(--cc-text, #1f2937);
  }

  // Bar layout: position inline instead of absolute
  .cc-layout-bar & {
    position: static;
    order: 99;
    margin-left: 8px;
  }
}

.cc-banner-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  color: var(--cc-primary-bg, #10b981);

  .cc-style-minimal & {
    margin-bottom: 0;
  }
}

.cc-banner-content {
  text-align: center;

  .cc-style-minimal & {
    text-align: left;
  }
}

.cc-banner-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--cc-text, #1f2937);
}

.cc-banner-message {
  font-size: 14px;
  line-height: 1.5;
  color: var(--cc-text-secondary, #6b7280);
  margin: 0 0 16px 0;

  .cc-style-minimal & {
    margin: 0;
    font-size: 13px;
  }
}

.cc-policy-link {
  color: var(--cc-link, #3b82f6);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.cc-banner-categories {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.cc-banner-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;

  .cc-style-minimal & {
    flex-wrap: nowrap;
    margin-top: 0;
  }

  // Button layouts
  &.cc-buttons-horizontal {
    flex-direction: row;
  }

  &.cc-buttons-vertical {
    flex-direction: column;

    .cc-btn {
      width: 100%;
    }
  }

  &.cc-buttons-inline {
    margin-top: 0;
    gap: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    .cc-btn {
      width: 100%;
    }
  }
}

.cc-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;

  &:focus {
    outline: 2px solid var(--cc-primary-bg, #10b981);
    outline-offset: 2px;
  }
}

.cc-btn-primary {
  background: var(--cc-primary-bg, #10b981);
  color: var(--cc-primary-text, #ffffff);

  &:hover {
    background: var(--cc-primary-hover, #059669);
  }
}

.cc-btn-secondary {
  background: var(--cc-secondary-bg, #f3f4f6);
  color: var(--cc-secondary-text, #374151);

  &:hover {
    background: var(--cc-secondary-hover, #e5e7eb);
  }
}

.cc-btn-link {
  background: transparent;
  color: var(--cc-link, #3b82f6);
  padding: 10px 12px;

  &:hover {
    text-decoration: underline;
  }
}

// ═══════════════════════════════════════════════════════════════
// SHAPE VARIATIONS
// ═══════════════════════════════════════════════════════════════
.cc-banner-container {
  // Pill shape (capsule)
  &.cc-shape-pill {
    .cc-banner {
      border-radius: 100px;
    }

    .cc-btn {
      border-radius: 100px;
    }
  }

  // Square shape (sharp corners)
  &.cc-shape-square {
    .cc-banner {
      border-radius: 0;
    }

    .cc-btn {
      border-radius: 0;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// DRAWER OVERLAY
// ═══════════════════════════════════════════════════════════════
.cc-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  pointer-events: auto;
  animation: cc-fade-in 0.2s ease-out;
}
</style>
