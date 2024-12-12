<template>
  <div class="app-textarea">
    <label class="flex flex-col gap-1">
      <div
        v-if="label"
        class="font-semibold"
      >
        {{ label }}
      </div>

      <div class="app-textarea-content">
        <textarea
          v-model="input"
          ref="textareaElement"
          class="resize-none"
          :placeholder="placeholder"
          :rows="rows"
          :style="{
            maxHeight,
            minHeight,
          }"
          :autofocus="autofocus"
          @input="onInput"
        />
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  label?: string;
  autofocus?: boolean;
  rows?: number;
  maxRows?: number;
}

interface Emit {
  (e: 'update:modelValue', value: Props['modelValue']): void;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  maxRows: 5,
});

const emit = defineEmits<Emit>();

const textareaElement = ref<HTMLTextAreaElement | undefined>(undefined);

const maxHeight = ref('0px');
const minHeight = ref('0px');

const { input, triggerResize } = useTextareaAutosize({
  element: textareaElement,
  styleProp: 'height',
});

const onInput = () => {
  if (!textareaElement.value) return;

  input.value = textareaElement.value.value;
  emit('update:modelValue', input.value);
};

const calculateInputHeight = () => {
  if (!textareaElement.value) return;

  const style = getComputedStyle(textareaElement.value);

  const lineHeight = parseFloat(style.lineHeight);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);

  const paddingY = paddingTop + paddingBottom;

  minHeight.value = `${props.rows * lineHeight + paddingY}px`;
  maxHeight.value = `${props.maxRows * lineHeight + paddingY}px`;
};

onMounted(() => {
  calculateInputHeight();
  triggerResize();
});

watch(() => props.rows, calculateInputHeight);
watch(() => props.maxRows, calculateInputHeight);
watch(
  () => props.modelValue,
  () => (input.value = props.modelValue),
  { immediate: true },
);

const focus = () => {
  textareaElement.value?.focus();
};

defineExpose({
  focus,
});
</script>

<style>
.app-textarea-content {
  @apply flex border border-black rounded-lg;
}

.app-textarea-content textarea {
  @apply text-base p-1.5 w-full rounded-lg;
}
</style>
