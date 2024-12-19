<template>
  <div class="bg-white flex items-center w-full h-screen px-6 py-4 overflow-hidden">
    <!-- Rating view -->
    <div
      v-if="!showCommentSection"
      class="w-full gap-6 md:gap-10 flex items-start md:items-center justify-center md:justify-start flex-col md:flex-row"
    >
      <div
        v-if="!satisfactionScoreForm.rating"
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
        v-if="satisfactionScoreForm.rating"
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
        Ցանկանու՞մ եք թողնել մեկնաբանություն
      </button>

      <div class="flex w-full md:w-auto min-w-0">
        <template v-for="(item, index) in ratingOptions">
          <div
            class="w-16 px-1 md:px-1.5 first:pl-0 last:pr-0 box-content"
            @mouseenter="hoveredRatingIndex = item.value"
            @mouseleave="hoveredRatingIndex = 0"
          >
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
              :aria-label="item.ariaLabel"
              @click="handleFeedbackSubmission(item.value)"
              @focus="hoveredRatingIndex = item.value"
            >
              <AppStar
                :active="item.value <= hoveredRatingIndex || item.value <= (satisfactionScoreForm.rating ?? 0)"
              />
            </HenaketButton>
          </div>
        </template>
      </div>
    </div>

    <!-- Comment view -->
    <div
      v-if="showCommentSection && !satisfactionScoreForm.commentSubmitted"
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
        <HenaketInputField
          v-model="satisfactionScoreForm.comment"
          ref="feedbackTextareaSmallElement"
          class="w-full hidden md:block"
          placeholder="Մեկնաբանություն"
          @keydown.enter="submitFeedbackComment"
        />

        <HenaketTextarea
          v-model="satisfactionScoreForm.comment"
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
          <img
            src="~/assets/icons/send.svg"
            class="w-6 h-6"
          />
        </button>
      </div>
    </div>

    <!-- Success view -->
    <div
      v-if="showCommentSection && satisfactionScoreForm.commentSubmitted"
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
  {
    ariaLabel: 'Շատ վատ',
    value: 1,
  },
  {
    ariaLabel: 'Վատ',
    value: 2,
  },
  {
    ariaLabel: 'Բավարար',
    value: 3,
  },
  {
    ariaLabel: 'Լավ',
    value: 4,
  },
  {
    ariaLabel: 'Գերազանց',
    value: 5,
  },
];

useHead({
  title: 'Գնահատեք ծառայությունը',
  meta: [{ name: 'description', content: 'Օգտատիրոջ գնահատականը ծառայության մասին' }],
  htmlAttrs: { lang: 'hy' },
});

const icons = importFolder(import.meta.glob('@/assets/icons/*', { eager: true }));

const hoveredRatingIndex = ref(0);
const showCommentSection = ref(false);
const feedbackTextareaSmallElement = ref<HTMLTextAreaElement | undefined>(undefined);
const feedbackTextareaBigElement = ref<HTMLTextAreaElement | undefined>(undefined);

const { satisfactionScoreForm, submitSatisfactionScore } = useSatisfactionScore();

const handleFeedbackSubmission = async (ratingValue?: number) => {
  if (ratingValue) {
    satisfactionScoreForm.rating = ratingValue;
  }

  await submitSatisfactionScore();
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
  satisfactionScoreForm.commentSubmitted = true;

  await submitSatisfactionScore();
};
</script>

<style>
.app-textarea-content {
  @apply rounded-e-none;
}

.henaket-input-field-content {
  @apply rounded-e-none h-full;
}
</style>
