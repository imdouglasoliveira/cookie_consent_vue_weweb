<template>
  <div class="cc-expandable-list">
    <!-- Info Items (non-toggleable) -->
    <div
      v-for="(item, index) in infoItems"
      :key="'info-' + index"
      class="cc-expandable-item cc-expandable-item-info"
      :class="{ 'cc-expandable-item-expanded': expandedItems[item.key] }"
      @click="toggleExpand(item.key)"
    >
      <div class="cc-expandable-item-header">
        <div class="cc-expandable-item-icon">
          <svg v-if="item.icon === 'settings'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else-if="item.icon === 'check'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <path d="m9 11 3 3L22 4"/>
          </svg>
        </div>
        <span class="cc-expandable-item-label">{{ item.label }}</span>
        <span class="cc-expandable-item-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </span>
      </div>
      <div v-if="expandedItems[item.key] && item.description" class="cc-expandable-item-content">
        <p>{{ item.description }}</p>
      </div>
    </div>

    <!-- Toggle Items (with switch) -->
    <div
      v-for="(item, index) in toggleItems"
      :key="'toggle-' + index"
      class="cc-expandable-item cc-expandable-item-toggle"
      :class="{ 'cc-expandable-item-expanded': expandedItems[item.key] }"
    >
      <div class="cc-expandable-item-header" @click="toggleExpand(item.key)">
        <div class="cc-expandable-item-icon">
          <svg v-if="item.icon === 'analytics'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          <svg v-else-if="item.icon === 'marketing'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 11 18-5v12L3 14v-3z"/>
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
        <span class="cc-expandable-item-label">{{ item.label }}</span>
        <label class="cc-toggle-mini" @click.stop>
          <input
            type="checkbox"
            :checked="item.checked"
            @change="$emit('toggle', item.key, $event.target.checked)"
          />
          <span class="cc-toggle-mini-slider"></span>
        </label>
        <span class="cc-expandable-item-arrow" @click.stop="toggleExpand(item.key)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </span>
      </div>
      <div v-if="expandedItems[item.key] && item.description" class="cc-expandable-item-content">
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpandableCategory',
  props: {
    infoItems: {
      type: Array,
      default: () => [],
    },
    toggleItems: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['toggle'],
  data() {
    return {
      expandedItems: {},
    };
  },
  methods: {
    toggleExpand(key) {
      this.expandedItems = {
        ...this.expandedItems,
        [key]: !this.expandedItems[key],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-expandable-list {
  display: flex;
  flex-direction: column;
}

.cc-expandable-item {
  border-bottom: 1px solid var(--cc-border, #e5e7eb);

  &:last-child {
    border-bottom: none;
  }
}

.cc-expandable-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }
}

.cc-expandable-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cc-text-secondary, #6b7280);
  flex-shrink: 0;
}

.cc-expandable-item-label {
  flex: 1;
  font-size: 14px;
  color: var(--cc-text, #1f2937);
}

.cc-expandable-item-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cc-text-secondary, #9ca3af);
  transition: transform 0.2s ease;
  flex-shrink: 0;

  .cc-expandable-item-expanded & {
    transform: rotate(90deg);
  }
}

.cc-expandable-item-content {
  padding: 0 16px 14px 46px;

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--cc-text-secondary, #6b7280);
  }
}

// Mini Toggle Switch
.cc-toggle-mini {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  margin-right: 4px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .cc-toggle-mini-slider {
      background: var(--cc-toggle-on, #10b981);
    }

    &:checked + .cc-toggle-mini-slider::before {
      transform: translateX(16px);
    }

    &:focus + .cc-toggle-mini-slider {
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
    }
  }
}

.cc-toggle-mini-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--cc-toggle-off, #d1d5db);
  transition: all 0.2s ease;
  border-radius: 20px;

  &::before {
    content: '';
    position: absolute;
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background: white;
    transition: all 0.2s ease;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
}
</style>
