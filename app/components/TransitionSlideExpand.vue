<template>
  <Transition
    name="slide-expand"
    mode="out-in"
    @enter="enter"
    @before-leave="beforeLeave"
    @leave="leave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'animation:start': [];
  'animation:end': [];
}>();

const enter = (el: Element, done: () => void) => {
  (el as HTMLElement).style.maxHeight = `${el.scrollHeight * 2}px`;

  const onTransitionEnd = (event: Event) => {
    if (event.target !== el) return;

    (el as HTMLElement).style.maxHeight = '';
    done();
    el.removeEventListener('transitionend', onTransitionEnd);
    emit('animation:end');
  };

  el.addEventListener('transitionend', onTransitionEnd);
};

const beforeLeave = (el: Element) => {
  emit('animation:start');

  (el as HTMLElement).style.maxHeight = `${el.scrollHeight}px`;
};

const leave = (el: Element, done: () => void) => {
  const htmlEl = el as HTMLElement;

  htmlEl.style.maxHeight = `${htmlEl.scrollHeight}px`;

  requestAnimationFrame(() => {
    htmlEl.style.maxHeight = '0px';
  });

  const onTransitionEnd = (event: Event) => {
    if (event.target !== el) return;

    done();
    el.removeEventListener('transitionend', onTransitionEnd);
  };

  el.addEventListener('transitionend', onTransitionEnd);
};
</script>

<style>
.slide-expand-enter-active,
.slide-expand-leave-active {
  @apply max-h-11 translate-y-0 transition-[transform,opacity,max-height] duration-500;
}

.slide-expand-enter-from,
.slide-expand-leave-to {
  @apply translate-y-full opacity-0;
}
</style>
