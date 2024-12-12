<template>

  <div class="w-full px-6 py-4 border border-text-500 rounded-3xl shadow-[0_0_24px_0_#00000026]">

    <div class="w-full gap-8 flex items-start md:items-center justify-between flex-col md:flex-row">

      <div class="text-text-700 text-base font-semibold leading-normal">
        Ինչպե՞ս կգնահատեք ծառայությունը
      </div>

      <div class="w-auto flex gap-4">
        <HenaketButton
          v-for="item in ratingOptions"
          variant="floating"
        >
          <span class="text-lg">{{ item.label }}</span>
        </HenaketButton>
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
const ratingOptions = [
  { label: '😡', value: 1 },
  { label: '😐', value: 2 },
  { label: '😊', value: 3 },
  { label: '😍', value: 4 },
  { label: '🤩', value: 5 },
];
</script>
