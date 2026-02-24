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
        {{ currentTexts.rating.question }}
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
        {{ currentTexts.rating.leaveComment }}
      </button>

      <div class="flex w-full md:w-auto min-w-0">
        <template v-for="(item, index) in ratingOptions" :key="item.value">
          <div
            class="w-16 pr-1 md:pr-3 last:pr-0 box-content"
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
          :placeholder="currentTexts.rating.commentPlaceholder"
          @keydown.enter="submitFeedbackComment"
        />

        <HenaketTextarea
          v-model="satisfactionScoreForm.comment"
          ref="feedbackTextareaBigElement"
          class="w-full block md:hidden"
          :placeholder="currentTexts.rating.commentPlaceholder"
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
        {{ currentTexts.rating.thanks }} <span class="text-3xl md:text-base">🎉</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const translations = {
  hy: {
    rating: {
      question: 'Ինչպե՞ս կգնահատեք ծառայությունը',
      leaveComment: 'Ցանկանու՞մ եք թողնել մեկնաբանություն',
      commentPlaceholder: 'Մեկնաբանություն',
      thanks: 'Շնորհակալություն արձագանքի համար',
      labels: {
        '1': 'Շատ վատ',
        '2': 'Վատ',
        '3': 'Բավարար',
        '4': 'Լավ',
        '5': 'Գերազանց',
      },
    },
    meta: {
      title: 'Գնահատեք ծառայությունը',
      description: 'Օգտատիրոջ գնահատականը ծառայության մասին',
    },
  },
  en: {
    rating: {
      question: 'How would you rate the service?',
      leaveComment: 'Would you like to leave a comment?',
      commentPlaceholder: 'Comment',
      thanks: 'Thank you for your feedback',
      labels: {
        '1': 'Very bad',
        '2': 'Bad',
        '3': 'Fair',
        '4': 'Good',
        '5': 'Excellent',
      },
    },
    meta: {
      title: 'Rate the service',
      description: 'User rating about the service',
    },
  },
} as const;

const currentLang = computed<'hy' | 'en'>(() => {
  const q = route.query.lang;
  return q === 'en' ? 'en' : 'hy';
});

const currentTexts = computed(() => translations[currentLang.value]);

const ratingOptions = computed(() => [
  {
    ariaLabel: currentTexts.value.rating.labels['1'],
    value: 1,
  },
  {
    ariaLabel: currentTexts.value.rating.labels['2'],
    value: 2,
  },
  {
    ariaLabel: currentTexts.value.rating.labels['3'],
    value: 3,
  },
  {
    ariaLabel: currentTexts.value.rating.labels['4'],
    value: 4,
  },
  {
    ariaLabel: currentTexts.value.rating.labels['5'],
    value: 5,
  },
]);

useHead(() => {
  const t = currentTexts.value;

  return {
    title: t.meta.title,
    meta: [{ name: 'description', content: t.meta.description }],
    htmlAttrs: { lang: currentLang.value },
  };
});

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
