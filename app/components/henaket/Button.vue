<template>
  <button
    ref="buttonElement"
    class="app-button"
    :disabled="disabled"
    :class="buttonClasses"
    @click="removeButtonFocus"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
export type HenaketButtonSizes = 'regular' | 'large';

export type HenaketButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'icon'
  | 'floating'
  | 'toTop'
  | 'yesem'
  | 'start'
  | 'rating';

type Props = {
  disabled?: boolean;
  variant?: HenaketButtonVariants;
  size?: HenaketButtonSizes;
};

interface Emit {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'regular',
});

const emit = defineEmits<Emit>();

const buttonElement = ref<HTMLButtonElement | null>();

const buttonClasses = computed(() => [
  props.disabled ? 'pointer-events-none select-none opacity-30' : 'opacity-100',
  props.variant,
  props.size,
]);

const removeButtonFocus = () => {
  emit('click');

  if (!buttonElement.value) return;

  buttonElement.value.blur();
};
</script>

<style>
.app-button {
  @apply rounded border-2
    w-full no-underline flex items-center justify-center transition-[background-color,border-color,box-shadow];
}

.app-button > span {
  @apply no-underline focus:text-text-800;
}

.app-button.start {
  @apply bg-button-default text-white border-button-stroke
    hover:bg-button-hover
    active:bg-button-active;
}

.app-button.primary {
  @apply bg-primary text-white border-blue-600
    hover:bg-blue-900
    active:bg-blue-1000 active:border-blue-1100;
}

.app-button.secondary {
  @apply bg-blue-200 text-text-800 border-blue-700
    hover:bg-blue-300 hover:border-blue-900
    active:bg-blue-500 active:border-blue-1200 focus:!text-text-800;
}

.app-button.outlined {
  @apply bg-text-100 text-text-800 border-text-400
    hover:bg-text-200 hover:border-text-700
    active:bg-text-300 active:border-text-800;
}

.app-button.icon {
  @apply border-none bg-transparent text-text-800
    hover:bg-black/10 active:bg-black/15;
}

.app-button.floating {
  @apply rounded-full border-text-400 bg-text-100 text-text-800
    hover:bg-blue-300 active:bg-blue-500;
}

.app-button.toTop {
  @apply bg-blue-100 text-blue-1200 border-blue-1100
    hover:bg-blue-200
    active:bg-blue-300;
}

.app-button.yesem {
  @apply bg-yesem-primary text-white border-yesem-blue-600
    hover:bg-blue-900
    active:bg-blue-1000 active:border-blue-1100;
}

.app-button.rating {
  @apply rounded-full border-text-200 bg-text-100 text-text-800
    hover:border-text-300 hover:bg-white
    active:border-text-300 active:bg-blue-100;
}

.app-button.regular {
  @apply text-sm px-3 md:px-4 py-2;
}

.app-button.regular.icon,
.app-button.regular.floating {
  @apply text-sm p-1 md:p-2;
}

.app-button.regular.rating {
  @apply text-sm px-3 py-1.5 md:px-[17px] md:py-[9px];
}

.app-button.large {
  @apply text-base font-bold leading-tight px-3 md:px-4 py-3;
}

.app-button.large.icon,
.app-button.large.floating {
  @apply text-base font-bold p-4;
}
</style>
