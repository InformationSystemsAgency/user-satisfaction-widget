<template>
  <section class="thumbs-bar" :class="[animation ? 'overflow-hidden' : '']">
    <TransitionSlideExpand @animation:start="animation = true" @animation:end="animation = false">
      <!-- Initial view -->
      <div v-if="!satisfactionScoreForm.rating" key="initial" class="thumbs-bar-row">
        <div class="thumbs-bar-main">
          <p class="thumbs-bar-title">{{ texts.title }}</p>

          <div class="thumbs-bar-actions">
            <ThumbsButton v-for="item in ratingOptions" :key="item.value" @click="handleFeedbackSubmission(item.value)">
              {{ item.label }}
            </ThumbsButton>
          </div>
        </div>

        <div class="thumbs-bar-report">
          <ThumbsButton @click="handleFeedbackSubmission(3)">
            {{ texts.reportButton }}
          </ThumbsButton>
        </div>

      </div>

      <!-- Comment view -->
      <div v-else-if="satisfactionScoreForm.rating && !satisfactionScoreForm.commentSubmitted" key="comment"
        class="thumbs-bar-form">
        <div class="thumbs-bar-form-header">
          <p class="thumbs-bar-form-title">{{ selectedRatingOption?.title }}</p>
          <p v-if="selectedRatingOption?.description" class="thumbs-bar-form-description">
            {{ selectedRatingOption.description }}
          </p>
        </div>

        <HenaketTextarea v-if="selectedRatingOption?.showComment" ref="feedbackTextareaElement"
          v-model="satisfactionScoreForm.comment" class="thumbs-bar-textarea" :label="texts.commentLabel" :rows="3"
          :maxRows="5" />

        <div class="thumbs-bar-form-actions">
          <ThumbsButton @click="cancelFeedback()">
            {{ texts.cancelButton }}
          </ThumbsButton>

          <button class="thumbs-btn-primary" type="button" @click="submitFeedbackComment()">
            {{ texts.submitButton }}
          </button>
        </div>
      </div>

      <!-- Feedback success -->
      <div v-else-if="satisfactionScoreForm.rating && satisfactionScoreForm.commentSubmitted" key="feedback-success"
        class="thumbs-bar-message">
        {{ texts.thanksForFeedback }}
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
const feedbackTextareaElement = ref<{ focus: () => void } | undefined>(undefined);

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
.thumbs-bar {
  width: 100%;
  background: #f5f5f5;
  border-bottom: 2px solid #78c5c1;
}

@media (max-width: 768px) {
  .thumbs-bar-row {
    flex-direction: column;
    gap: 0;
  }
}

.thumbs-bar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 32px;
  row-gap: 16px;
  /* padding: 16px 0; */
}

.thumbs-bar-main {
  display: flex;
  align-items: center;
  column-gap: 32px;
  padding: 16px;
}

@media (max-width: 768px) {
  .thumbs-bar-main {
    justify-content: space-between;
    width: 100%;
    padding-bottom: 16px;
    border-bottom: 2px solid #78c5c1;
  }

  .thumbs-bar-row {
    padding-bottom: 16px;
  }
}

.thumbs-bar-report {
  padding: 0 16px;
}

.thumbs-bar-title {
  margin: 0;
  color: #454545;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.thumbs-bar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.thumbs-bar-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  max-width: 50%;
}

@media (max-width: 768px) {
  .thumbs-bar-form {
    max-width: 100%;
  }
}

.thumbs-bar-form-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.thumbs-bar-form-title {
  margin: 0;
  color: #454545;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}


.thumbs-bar-form-description {
  margin: 0;
  color: #454545;
  font-size: 14px;
  line-height: 24px;
}

.thumbs-bar-form-actions {
  display: flex;
  gap: 8px;
}

.thumbs-bar-form-actions>* {
  flex: 1;
}

.thumbs-btn-primary {
  padding: 8px 16px;
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  border-radius: 4px;
  border: 2px solid #355c8c;
  background: #355c8c;
  cursor: pointer;
}

.thumbs-btn-primary:hover {
  background: #2a4a70;
  border-color: #2a4a70;
}

.thumbs-btn-primary:focus-visible {
  outline: 3px solid #bd13b8;
  outline-offset: 2px;
}

.thumbs-bar-message {
  padding: 12px 16px;
  color: #454545;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.thumbs-bar-textarea :deep(.app-textarea-content) {
  border-radius: 4px;
}

@media (max-width: 768px) {
  .thumbs-btn {
    width: 100%;
  }

  .thumbs-bar-report {
    width: 100%;
  }
}

@media (max-width: 380px) {

  .thumbs-btn {
    font-size: 13px;
  }

  .thumbs-bar-title {
    font-size: 14px;
  }

  .thumbs-bar-main {
    column-gap: 11px;
  }
}
</style>
