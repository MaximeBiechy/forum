<script setup>
import {defineProps, ref, watch} from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'error',
  }
});

const isVisible = ref(false);

watch(() => props.isVisible, (newVal) => {
  isVisible.value = newVal;
});
</script>

<template>
  <transition name="toast">
    <div v-if="isVisible"
         :class="['toast', type]"
         id="toast">
      <div class="toast_icon" id="toast_icon">
        <svg :class="['icon', type]" fill="none" stroke="white"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" v-if="type === 'error'"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 13l4 4L19 7" v-if="type === 'success'"></path>
        </svg>
      </div>

      <div class="toast_message" id="toast_message">
        <p>{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  top: 8rem;
  right: 1rem;
  padding: 1rem;
  width: 20rem;
  border-radius: 1rem;
  z-index: 50;
}

.toast.error {
  background-color: var(--color-error);
}

.toast.success {
  background-color: var(--color-success);
}

.toast_icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon.success {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #10B981;
  border-radius: 50%;
}

.icon.error {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ef4444;
  border-radius: 50%;
}

.toast_message {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
}

.toast-enter-active, .toast-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.toast-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

p {
  color: black;
  font-family: monospace;
  word-break: break-word;
  white-space: normal;
  overflow: hidden;
}
</style>
