<template>
  <button class="thumbs-btn" type="button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: [];
}>();
</script>

<style>
.thumbs-btn {
  @apply rounded border-2 no-underline flex items-center justify-center
    bg-text-100 text-text-800 border-text-400
    hover:bg-text-200 hover:border-text-700
    active:bg-text-300 active:border-text-800
    text-sm px-3 md:px-4 py-2 cursor-pointer whitespace-nowrap w-full sm:w-auto;
}

.thumbs-btn:focus-visible {
  outline: 3px solid theme('colors.accessibility');
  outline-offset: 2px;
}
</style>
