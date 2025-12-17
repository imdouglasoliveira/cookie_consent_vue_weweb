<template>
  <div class="cc-preferences-overlay" @click.self="$emit('close')">
    <div class="cc-preferences" data-cc="preferences" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="cc-preferences-header">
        <h2 class="cc-preferences-title">{{ content.preferencesLabel }}</h2>
        <button
          class="cc-preferences-close"
          data-cc="close"
          aria-label="Close"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <!-- Categories -->
      <div class="cc-preferences-body">
        <!-- Essential (always on) -->
        <CategoryToggle
          :label="content.essentialLabel"
          :description="content.essentialDescription"
          :checked="true"
          :disabled="true"
          required-label="Required"
        />

        <!-- Analytics -->
        <CategoryToggle
          v-if="content.analyticsEnabled"
          :label="content.analyticsLabel"
          :description="content.analyticsDescription"
          :checked="tempPreferences.analytics"
          :disabled="false"
          data-cc-checkbox="analytics"
          @change="(val) => $emit('update-preference', 'analytics', val)"
        />

        <!-- Marketing -->
        <CategoryToggle
          v-if="content.marketingEnabled"
          :label="content.marketingLabel"
          :description="content.marketingDescription"
          :checked="tempPreferences.marketing"
          :disabled="false"
          data-cc-checkbox="marketing"
          @change="(val) => $emit('update-preference', 'marketing', val)"
        />

        <!-- Personalization -->
        <CategoryToggle
          v-if="content.personalizationEnabled"
          :label="content.personalizationLabel"
          :description="content.personalizationDescription"
          :checked="tempPreferences.personalization"
          :disabled="false"
          data-cc-checkbox="personalization"
          @change="(val) => $emit('update-preference', 'personalization', val)"
        />
      </div>

      <!-- Footer -->
      <div class="cc-preferences-footer">
        <button
          class="cc-btn cc-btn-secondary"
          data-cc="deny"
          @click="$emit('decline-all')"
        >
          {{ content.declineAllLabel }}
        </button>

        <button
          class="cc-btn cc-btn-secondary"
          data-cc="allow"
          @click="$emit('accept-all')"
        >
          {{ content.acceptAllLabel }}
        </button>

        <button
          class="cc-btn cc-btn-primary"
          data-cc="submit"
          @click="$emit('save')"
        >
          {{ content.savePreferencesLabel }}
        </button>
      </div>

      <!-- Policy Link -->
      <div class="cc-preferences-policy">
        <a
          :href="content.policyPageUrl"
          class="cc-policy-link"
          :target="content.policyLinkNewTab !== false ? '_blank' : '_self'"
          :rel="content.policyLinkNewTab !== false ? 'noopener noreferrer' : ''"
        >
          {{ content.policyLinkLabel }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryToggle from './CategoryToggle.vue';

export default {
  name: 'CookiePreferences',
  components: {
    CategoryToggle,
  },
  props: {
    content: { type: Object, required: true },
    tempPreferences: { type: Object, required: true },
  },
  emits: ['close', 'accept-all', 'decline-all', 'save', 'update-preference'],
  mounted() {
    // Focus trap
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-preferences-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 16px;
  animation: cc-fade-in 0.2s ease-out;
}

@keyframes cc-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.cc-preferences {
  background: var(--cc-bg, #ffffff);
  color: var(--cc-text, #1f2937);
  border-radius: var(--cc-radius, 12px);
  box-shadow: var(--cc-shadow);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: cc-scale-in 0.2s ease-out;

  @media (max-width: 768px) {
    max-height: 100%;
    border-radius: var(--cc-radius, 12px) var(--cc-radius, 12px) 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
  }
}

@keyframes cc-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cc-preferences-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--cc-border, #e5e7eb);
}

.cc-preferences-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--cc-text, #1f2937);
}

.cc-preferences-close {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--cc-text-secondary, #6b7280);
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--cc-secondary-bg, #f3f4f6);
    color: var(--cc-text, #1f2937);
  }

  &:focus {
    outline: 2px solid var(--cc-primary-bg, #10b981);
    outline-offset: 2px;
  }
}

.cc-preferences-body {
  padding: 16px 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cc-preferences-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--cc-border, #e5e7eb);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.cc-preferences-policy {
  padding: 12px 24px 20px;
  text-align: center;
}

.cc-policy-link {
  color: var(--cc-link, #3b82f6);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
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
  flex: 1;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: 2px solid var(--cc-primary-bg, #10b981);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 100%;
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
</style>
