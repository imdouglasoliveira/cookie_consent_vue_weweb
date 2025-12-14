<template>
  <div class="cc-category" :class="{ 'cc-category-compact': compact }">
    <div class="cc-category-header">
      <div class="cc-category-info">
        <span class="cc-category-label">{{ label }}</span>
        <span v-if="requiredLabel && disabled" class="cc-category-required">
          {{ requiredLabel }}
        </span>
      </div>
      <label class="cc-toggle" :class="{ 'cc-toggle-disabled': disabled }">
        <input
          type="checkbox"
          :checked="checked"
          :disabled="disabled"
          @change="handleChange"
        />
        <span class="cc-toggle-slider"></span>
      </label>
    </div>
    <p v-if="description && !compact" class="cc-category-description">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'CategoryToggle',
  props: {
    label: { type: String, required: true },
    description: { type: String, default: '' },
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    requiredLabel: { type: String, default: '' },
    compact: { type: Boolean, default: false },
  },
  emits: ['change'],
  methods: {
    handleChange(e) {
      if (!this.disabled) {
        this.$emit('change', e.target.checked);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-category {
  padding: 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid var(--cc-border, #e5e7eb);

  &.cc-category-compact {
    padding: 10px 12px;

    .cc-category-header {
      gap: 12px;
    }

    .cc-category-label {
      font-size: 13px;
    }
  }
}

.cc-category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.cc-category-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cc-category-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--cc-text, #1f2937);
}

.cc-category-required {
  font-size: 11px;
  font-weight: 500;
  color: var(--cc-text-secondary, #6b7280);
  background: var(--cc-secondary-bg, #f3f4f6);
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cc-category-description {
  font-size: 13px;
  color: var(--cc-text-secondary, #6b7280);
  margin: 8px 0 0 0;
  line-height: 1.5;
}

// Toggle Switch
.cc-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .cc-toggle-slider {
      background: var(--cc-toggle-on, #10b981);
    }

    &:checked + .cc-toggle-slider::before {
      transform: translateX(20px);
    }

    &:focus + .cc-toggle-slider {
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
    }

    &:disabled + .cc-toggle-slider {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.cc-toggle-disabled {
    cursor: not-allowed;
  }
}

.cc-toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--cc-toggle-off, #d1d5db);
  transition: all 0.2s ease;
  border-radius: 24px;

  &::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: white;
    transition: all 0.2s ease;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
}
</style>
