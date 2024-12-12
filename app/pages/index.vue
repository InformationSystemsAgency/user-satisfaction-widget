<template>
  <div class="flex items-center w-full h-screen px-6 py-4 border border-text-500 rounded-3xl overflow-hidden">
    <div
      v-if="!showCommentSection"
      class="w-full gap-6 md:gap-10 flex items-start md:items-center justify-center md:justify-between flex-col md:flex-row"
    >
      <div
        v-if="!feedbackForm.rating"
        v-motion="{
          initial: {
            y: 40,
            opacity: 0,
          },
          enter: {
            y: 0,
            opacity: 1,
          },
        }"
        class="text-text-700 text-sm md:text-base font-semibold leading-normal shrink-0"
      >
        Ինչպե՞ս կգնահատեք ծառայությունը
      </div>

      <button
        v-if="feedbackForm.rating"
        v-motion="{
          initial: {
            y: 40,
            opacity: 0,
          },
          enter: {
            y: 0,
            opacity: 1,
          },
        }"
        class="text-primary text-sm md:text-base font-semibold leading-normal shrink-0 underline hover:decoration-[3px] focus:!text-white focus:bg-accessibility focus:shadow-accessibilityOutline focus:animate-accessibility-outline-pulse"
        @click="openCommentSection"
      >
        Ցանկանում եք թողնել մեկնաբանություն
      </button>

      <div class="flex gap-3 w-full md:w-auto min-w-0">
        <template v-for="(item, index) in ratingOptions">
          <HenaketButton
            v-motion="{
              initial: {
                y: 40,
                opacity: 0,
              },
            }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: {
                duration: 400,
              },
            }"
            :delay="100 + 40 * index"
            variant="rating"
            :active="item.value === feedbackForm.rating"
            @click="handleFeedbackSubmission(item.value)"
          >
            <span class="text-2xl">{{ item.label }}</span>
          </HenaketButton>
        </template>
      </div>
    </div>

    <div
      v-if="showCommentSection && !feedbackForm.commentSubmitted"
      v-motion="{
        initial: {
          y: 40,
          opacity: 0,
        },
        enter: {
          y: 0,
          opacity: 1,
        },
      }"
      class="w-full"
    >
      <div class="w-full flex">
        <HenaketTextarea
          v-model="feedbackForm.comment"
          ref="feedbackTextareaSmallElement"
          class="w-full hidden md:block"
          placeholder="Մեկնաբանություն"
          :rows="1"
          :maxRows="1"
        />

        <HenaketTextarea
          v-model="feedbackForm.comment"
          ref="feedbackTextareaBigElement"
          class="w-full block md:hidden"
          placeholder="Մեկնաբանություն"
          :rows="2"
          :maxRows="2"
        />

        <button
          class="bg-primary text-text-100 p-2 rounded-e-lg border border-black border-l-0"
          @click="submitFeedbackComment"
        >
          <HenaketIcon
            icon="send"
            size="24px"
          />
        </button>
      </div>
    </div>

    <div
      v-if="showCommentSection && feedbackForm.commentSubmitted"
      v-motion="{
        initial: {
          y: 40,
          opacity: 0,
        },
        enter: {
          y: 0,
          opacity: 1,
        },
      }"
      class="w-full"
    >
      <div
        class="w-full text-base font-semibold text-text-700 grow flex text-center flex-col-reverse md:flex-row gap-1"
      >
        Շնորհակալություն արձագանքի համար <span class="text-3xl md:text-base">🎉</span>
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

const showCommentSection = ref(false);
const feedbackTextareaSmallElement = ref<HTMLTextAreaElement | undefined>(undefined);
const feedbackTextareaBigElement = ref<HTMLTextAreaElement | undefined>(undefined);

const feedbackForm = reactive<{
  id?: string;
  rating?: number;
  comment: string;
  commentSubmitted: boolean;
}>({
  comment: '',
  commentSubmitted: false,
});

const handleFeedbackSubmission = async (ratingValue?: number) => {
  if (ratingValue) {
    feedbackForm.rating = ratingValue;
  }

  // await submitFeedback();
};

const openCommentSection = () => {
  showCommentSection.value = true;

  // Focus on the textarea after the animation
  setTimeout(() => {
    feedbackTextareaSmallElement.value?.focus();
    feedbackTextareaBigElement.value?.focus();
  }, 400);
};

const submitFeedbackComment = async () => {
  feedbackForm.commentSubmitted = true;
};
</script>

<style>
.app-button {
  @apply w-24 flex-1;
}

.app-button[active='true'] {
  @apply pointer-events-none bg-blue-300 border-text-600;
}

.app-textarea-content {
  @apply rounded-e-none;
}
</style>
