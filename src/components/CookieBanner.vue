<template>
  <div class="cc-banner-container" :class="positionClass">
    <div class="cc-banner" :class="styleClass" data-cc="banner">
      <!-- Cookie Icon -->
      <div class="cc-banner-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      <div class="cc-banner-actions">
        <!-- Preferences button (hidden in minimal) -->
        <button
          v-if="content.bannerStyle !== 'minimal' && content.consentMode !== 'informational'"
          class="cc-btn cc-btn-link"
          data-cc="open-preferences"
          @click="$emit('open-preferences')"
        >
          {{ content.preferencesLabel }}
        </button>

        <!-- Decline button -->
        <button
          v-if="content.consentMode !== 'informational'"
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
      return `cc-position-${this.content.position || 'bottom-left'}`;
    },
    styleClass() {
      return `cc-style-${this.content.bannerStyle || 'standard'}`;
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

  // Position classes
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

  @media (max-width: 768px) {
    left: 0 !important;
    right: 0 !important;
    transform: none !important;
    padding: 12px;

    &.cc-position-bottom-left,
    &.cc-position-bottom-right,
    &.cc-position-bottom-center {
      bottom: 0;
      top: auto;
    }

    &.cc-position-top-left,
    &.cc-position-top-right,
    &.cc-position-top-center {
      top: 0;
      bottom: auto;
    }
  }
}

.cc-banner {
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

  .cc-style-minimal & {
    flex-wrap: nowrap;
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
</style>
