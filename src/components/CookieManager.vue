<template>
  <div class="cc-manager-container" :class="positionClass">
    <button
      class="cc-manager-btn"
      data-cc="manager"
      data-cc-action="open-preferences"
      :title="content.preferencesLabel"
      @click="$emit('manager-click')"
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
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
        <path d="M8.5 8.5v.01" />
        <path d="M16 15.5v.01" />
        <path d="M12 12v.01" />
        <path d="M11 17v.01" />
        <path d="M7 14v.01" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CookieManager',
  props: {
    content: { type: Object, required: true },
  },
  emits: ['manager-click'],
  computed: {
    positionClass() {
      return `cc-manager-${this.content.managerPosition || 'bottom-left'}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.cc-manager-container {
  position: fixed;
  z-index: 9998;
  padding: 16px;

  &.cc-manager-bottom-left {
    bottom: 0;
    left: 0;
  }

  &.cc-manager-bottom-right {
    bottom: 0;
    right: 0;
  }
}

.cc-manager-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--cc-bg, #ffffff);
  border: 1px solid var(--cc-border, #e5e7eb);
  box-shadow: var(--cc-shadow);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cc-primary-bg, #10b981);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: 2px solid var(--cc-primary-bg, #10b981);
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
