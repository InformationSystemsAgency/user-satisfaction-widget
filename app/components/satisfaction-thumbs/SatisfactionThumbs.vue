<template>
  <section
    ref="thumbsBarElement"
    class="thumbs-bar w-full bg-text-200 flex items-center border-b-2 border-secondary"
    :class="[animation ? 'overflow-hidden' : '']"
  >
    <TransitionSlideExpand @animation:start="animation = true" @animation:end="onAnimationEnd">
      <!-- Initial view -->
      <div
        v-if="!satisfactionScoreForm.rating"
        key="initial"
        class="w-full flex flex-col sm:flex-row justify-between"
      >
        <div class="flex p-4 gap-8 justify-between flex-row items-center">
          <div class="text-text-700 text-base font-semibold leading-normal">
            {{ texts.title }}
          </div>

          <div class="w-auto flex gap-4">
            <ThumbsButton
              v-for="item in ratingOptions"
              :key="item.value"
              @click="handleFeedbackSubmission(item.value)"
            >
              {{ item.label }}
            </ThumbsButton>
          </div>
        </div>

        <div class="flex sm:hidden w-full h-0.5 bg-secondary"></div>

        <div class="basis-full sm:basis-auto p-4">
          <ThumbsButton @click="handleFeedbackSubmission(3)">
            {{ texts.reportButton }}
          </ThumbsButton>
        </div>
      </div>

      <!-- Comment view -->
      <div
        v-else-if="satisfactionScoreForm.rating && !satisfactionScoreForm.commentSubmitted"
        key="comment"
        class="w-full flex"
      >
        <div class="w-full p-4 flex gap-4 flex-col basis-full md:basis-1/2">
          <div class="flex flex-col gap-1">
            <div class="text-base font-semibold text-text-700 grow">
              {{ selectedRatingOption?.title }}
            </div>

            <p
              v-if="selectedRatingOption?.description"
              class="text-sm text-text-700 m-0"
            >
              {{ selectedRatingOption.description }}
            </p>
          </div>

          <div class="w-full flex flex-col gap-3 grow-0">
            <HenaketTextarea
              v-if="selectedRatingOption?.showComment"
              ref="feedbackTextareaElement"
              v-model="satisfactionScoreForm.comment"
              class="w-full"
              :label="texts.commentLabel"
              :rows="3"
              :maxRows="5"
            />

            <div class="flex gap-2">
              <ThumbsButton class="grow" @click="cancelFeedback()">
                {{ texts.cancelButton }}
              </ThumbsButton>

              <button class="thumbs-btn-primary grow" type="button" @click="submitFeedbackComment()">
                {{ texts.submitButton }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback success -->
      <div
        v-else-if="satisfactionScoreForm.rating && satisfactionScoreForm.commentSubmitted"
        key="feedback-success"
        class="w-full px-4 py-3"
      >
        <div class="text-base font-semibold text-text-700 grow">
          {{ texts.thanksForFeedback }}
        </div>
      </div>
    </TransitionSlideExpand>
  </section>
</template>

<script setup lang="ts">
import ThumbsButton from './ThumbsButton.vue';

const route = useRoute();

const translations = {
  hy: {
    title: 'Այս էջը օգտակա՞ր էր:',
    reportButton: 'Տեղեկացրու առաջացած խնդրի մասին',
    commentLabel: 'Մեկնաբանություն',
    cancelButton: 'Չեղարկել',
    submitButton: 'Ուղարկել',
    thanksForFeedback: 'Շնորհակալություն արձագանքի համար',
    reportTitle: 'Տեղեկացրեք առաջացած խնդրի մասին',
    reportDescription: 'Խնդրում ենք նկարագրել խնդիրը, և մենք կկապվենք ձեզ հետ։',
    reportEmailLabel: 'Էլ. հասցե',
    reportDescriptionLabel: 'Խնդրի նկարագրություն',
    reportDescriptionRequired: 'Դաշտը պարտադիր է',
    reportCancelButton: 'Չեղարկել',
    reportSubmitButton: 'Ուղարկել',
    reportThanksForReporting: 'Շնորհակալություն տեղեկացման համար',
    rating: {
      yes: {
        label: 'Այո 👍',
        title: 'Շնորհակալություն արձագանքի համար',
        description: 'Կարող եք կիսվել լրացուցիչ մեկնաբանություններով։',
      },
      no: {
        label: 'Ոչ 👎',
        title: 'Ցավում ենք, որ էջը օգտակար չէր',
        description: 'Օգնեք մեզ բարելավվել՝ նկարագրելով խնդիրը։',
      },
    },
    meta: {
      title: 'Գնահատեք էջը',
      description: 'Օգտատիրոջ գնահատականը էջի մասին',
    },
  },
  en: {
    title: 'Was this page helpful?',
    reportButton: 'Report an issue',
    commentLabel: 'Comment',
    cancelButton: 'Cancel',
    submitButton: 'Submit',
    thanksForFeedback: 'Thank you for your feedback',
    reportTitle: 'Report an issue',
    reportDescription: 'Please describe the issue and we will get back to you.',
    reportEmailLabel: 'Email',
    reportDescriptionLabel: 'Issue description',
    reportDescriptionRequired: 'This field is required',
    reportCancelButton: 'Cancel',
    reportSubmitButton: 'Submit',
    reportThanksForReporting: 'Thank you for reporting',
    rating: {
      yes: {
        label: 'Yes 👍',
        title: 'Thank you for your feedback',
        description: 'You can share additional comments.',
      },
      no: {
        label: 'No 👎',
        title: 'Sorry the page was not helpful',
        description: 'Help us improve by describing the issue.',
      },
    },
    meta: {
      title: 'Rate this page',
      description: 'User rating about the page',
    },
  },
  ru: {
    title: 'Была ли эта страница полезной?',
    reportButton: 'Сообщить о проблеме',
    commentLabel: 'Комментарий',
    cancelButton: 'Отмена',
    submitButton: 'Отправить',
    thanksForFeedback: 'Спасибо за ваш отзыв',
    reportTitle: 'Сообщить о проблеме',
    reportDescription: 'Пожалуйста, опишите проблему, и мы свяжемся с вами.',
    reportEmailLabel: 'Эл. почта',
    reportDescriptionLabel: 'Описание проблемы',
    reportDescriptionRequired: 'Поле обязательно',
    reportCancelButton: 'Отмена',
    reportSubmitButton: 'Отправить',
    reportThanksForReporting: 'Спасибо за сообщение',
    rating: {
      yes: {
        label: 'Да 👍',
        title: 'Спасибо за ваш отзыв',
        description: 'Вы можете поделиться дополнительными комментариями.',
      },
      no: {
        label: 'Нет 👎',
        title: 'Сожалеем, что страница не была полезной',
        description: 'Помогите нам улучшиться, описав проблему.',
      },
    },
    meta: {
      title: 'Оцените страницу',
      description: 'Оценка пользователя страницы',
    },
  },
} as const;

const currentLang = computed<'hy' | 'en' | 'ru'>(() => {
  const q = route.query.lang;
  if (q === 'en' || q === 'ru') return q;
  return 'hy';
});

const texts = computed(() => {
  const t = translations[currentLang.value];

  return {
    ...t,
    thanksForReporting: t.reportThanksForReporting,
  };
});

const ratingOptions = computed(() => [
  {
    value: 5,
    label: texts.value.rating.yes.label,
    title: texts.value.rating.yes.title,
    description: texts.value.rating.yes.description,
    showComment: true,
  },
  {
    value: 1,
    label: texts.value.rating.no.label,
    title: texts.value.rating.no.title,
    description: texts.value.rating.no.description,
    showComment: true,
  },
]);

const {
  satisfactionScoreForm,
  submitSatisfactionScore,
  cancelFeedback,
} = useThumbsFeedback();

const selectedRatingOption = computed(() => {
  if (satisfactionScoreForm.rating === 3) {
    return {
      value: 3,
      title: texts.value.reportTitle,
      description: texts.value.reportDescription,
      showComment: true,
    };
  }

  return ratingOptions.value.find(option => option.value === satisfactionScoreForm.rating);
});

useHead(() => {
  const t = texts.value;

  return {
    title: t.meta.title,
    meta: [{ name: 'description', content: t.meta.description }],
    htmlAttrs: { lang: currentLang.value },
  };
});

const animation = ref(false);
const thumbsBarElement = ref<HTMLElement | undefined>(undefined);
const feedbackTextareaElement = ref<{ focus: () => void } | undefined>(undefined);

const { postHeight } = useIframeAutoHeight(thumbsBarElement);

const onAnimationEnd = () => {
  animation.value = false;
  postHeight();
};

const handleFeedbackSubmission = async (ratingValue?: number) => {
  if (ratingValue) {
    satisfactionScoreForm.rating = ratingValue;

    setTimeout(() => feedbackTextareaElement.value?.focus(), 300);
  }

  await submitSatisfactionScore();
};

const submitFeedbackComment = async () => {
  satisfactionScoreForm.commentSubmitted = true;

  await submitSatisfactionScore();
};
</script>

<style scoped>
.thumbs-btn-primary {
  @apply rounded border-2 no-underline flex items-center justify-center
    bg-primary text-white border-blue-600
    hover:bg-blue-900
    active:bg-blue-1000 active:border-blue-1100
    text-sm px-3 md:px-4 py-2 cursor-pointer;
}

.thumbs-btn-primary:focus-visible {
  outline: 3px solid theme('colors.accessibility');
  outline-offset: 2px;
}
</style>
