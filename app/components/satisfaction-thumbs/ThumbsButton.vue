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
  padding: 8px 16px;
  color: #454545;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  border-radius: 4px;
  border: 2px solid var(--TextColor-TextBlack400, #bfbfbf);
  background: var(--TextColor-TextBlack100, #fff);
  cursor: pointer;
  white-space: nowrap;
}

.thumbs-btn:hover {
  background: #f5f5f5;
}

.thumbs-btn:focus-visible {
  outline: 3px solid #bd13b8;
  outline-offset: 2px;
}
</style>
