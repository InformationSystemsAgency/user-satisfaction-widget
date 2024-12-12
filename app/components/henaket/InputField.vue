<template>
  <div class="henaket-input-field flex">
    <div
      class="shrink-0 bg-systemMessage-error transition-[width,margin] duration-300"
      :class="errorMessage ? 'w-1 mr-4' : 'w-0 mr-0'"
    ></div>

    <label class="flex flex-col gap-1">
      <div
        v-if="label"
        class="font-semibold"
      >
        {{ label }}
      </div>

      <div
        v-if="errorMessage"
        class="font-semibold text-systemMessage-error"
      >
        {{ errorMessage }}
      </div>

      <div
        class="henaket-input-field-content"
        :class="[errorMessage ? 'border-systemMessage-error' : 'border-black']"
      >
        <div
          v-if="prefix"
          class="px-3 py-2 shrink-0 border-r bg-text-200 rounded-s-[3px]"
          :class="[errorMessage ? 'border-systemMessage-error' : 'border-black']"
        >
          <div>{{ prefix }}</div>
        </div>

        <input
          v-model="input"
          ref="inputFieldElement"
          :type="type"
          @input="onInput"
          @blur="onBlur"
        />

        <div
          v-if="postfix"
          class="px-3 py-2 shrink-0 border-l bg-text-200 rounded-e-[3px]"
          :class="[errorMessage ? 'border-systemMessage-error' : 'border-black']"
        >
          <div>{{ postfix }}</div>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
type ValidationResult = string | boolean;

type ValidationRule =
  | ValidationResult
  | PromiseLike<ValidationResult>
  | ((value: any) => ValidationResult)
  | ((value: any) => PromiseLike<ValidationResult>);

type Props = {
  modelValue: string;
  rules?: ValidationRule[];
  type?: string;
  label?: string;
  prefix?: string;
  postfix?: string;
};

interface Emit {
  (e: 'update:modelValue', value: Props['modelValue']): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
});

const emit = defineEmits<Emit>();

const inputFieldElement = ref<HTMLInputElement | null>(null);
const input = ref('');

const errorMessage = ref<string | boolean>('');

watch(
  () => props.modelValue,
  () => (input.value = props.modelValue),
  { immediate: true },
);

const onInput = () => {
  if (!inputFieldElement.value) return;

  input.value = inputFieldElement.value.value;
  emit('update:modelValue', input.value);
};

const onBlur = () => {
  validate();
};

const validate = async () => {
  if (!props.rules) return;

  for (const rule of props.rules) {
    const handler = typeof rule === 'function' ? rule : () => rule;
    const result = await handler(input.value);

    if (result === true) continue;

    if (result !== false && typeof result !== 'string') continue;

    errorMessage.value = result;
    return;
  }

  errorMessage.value = false;
};

const focus = () => {
  inputFieldElement.value?.focus();
};

defineExpose({
  focus,
});
</script>

<style>
.henaket-input-field-content {
  @apply flex border rounded;
}

.henaket-input-field-content input {
  @apply p-2 w-full rounded focus:z-10;
}

/* Chrome, Safari, Edge, Opera */
.henaket-input-field-content input::-webkit-outer-spin-button,
.henaket-input-field-content input::-webkit-inner-spin-button {
  @apply m-0 appearance-none;
}

/* Firefox */
.henaket-input-field-content input[type='number'] {
  appearance: textfield;
}
</style>
