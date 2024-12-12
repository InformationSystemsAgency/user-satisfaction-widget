<template>
  <div class="w-full h-[126px] md:h-20 px-6 py-4 border border-text-500 rounded-3xl overflow-hidden flex items-center">
    <div
      v-if="!showCommentSection"
      class="w-full gap-10 flex items-start md:items-center justify-between flex-col md:flex-row"
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
        class="text-text-700 text-base font-semibold leading-normal shrink-0"
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
        class="text-primary text-base font-semibold leading-normal shrink-0 underline hover:decoration-[3px] focus:!text-white focus:bg-accessibility focus:shadow-accessibilityOutline focus:animate-accessibility-outline-pulse"
        @click="openCommentSection"
      >
        Ցանկանում եք թողնել մեկնաբանություն
      </button>

      <div class="flex gap-3 min-w-0">
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
          ref="feedbackTextareaElement"
          class="w-full"
          placeholder="Մեկնաբանություն"
          :rows="1"
          :maxRows="1"
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
    >
      <div class="text-base font-semibold text-text-700 grow">Շնորհակալություն արձագանքի համար 🎉</div>
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
const feedbackTextareaElement = ref<HTMLTextAreaElement | undefined>(undefined);

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
  setTimeout(() => feedbackTextareaElement.value?.focus(), 400);
};

const submitFeedbackComment = async () => {
  feedbackForm.commentSubmitted = true;
};
</script>

<style>
.app-button {
  @apply w-24;
}

.app-button[active='true'] {
  @apply pointer-events-none bg-blue-300 border-text-600;
}

.app-textarea-content {
  @apply rounded-e-none;
}
</style>
