<template>
  <span
    class="app-icon select-none"
    :data-icon-name="icon"
    :style="{ fontSize: size }"
  ></span>
</template>

<script setup lang="ts">
type Props = {
  icon: string;
  size?: string;
};

defineProps<Props>();
</script>

<style>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-feature-settings: 'liga';
  min-width: 1em;
  width: 1em;
  height: 1em;
  letter-spacing: normal;
  line-height: 1;
  text-indent: 0;
  text-align: center;
  vertical-align: middle;
}

.app-icon::before {
  content: attr(data-icon-name);
  display: inline-block;
  font-family: 'Material Symbols Outlined';
  font: normal normal normal 1em/1;
  text-rendering: auto;
  text-decoration: inherit;
  -webkit-font-smoothing: antialiased;
}
</style>
