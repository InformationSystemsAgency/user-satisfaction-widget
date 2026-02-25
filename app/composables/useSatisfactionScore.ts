interface SatisfactionScoreRequest {
  id?: string;
  serviceId: string;
  serviceProvisionChannel?: string;
  institutionId?: string;
  transactionId?: string;
  rating: number;
  comment: string;
  commentSubmitted: boolean;
  userAgent: string;
  pageLanguage: string;
}

interface SatisfactionScoreResponse {
  id: string;
}

const satisfactionScoreForm = reactive<{
  id?: string;
  rating?: number;
  comment: string;
  commentSubmitted: boolean;
}>({
  comment: '',
  commentSubmitted: false,
});

export const useSatisfactionScore = () => {
  const { $useNPSApi } = useNuxtApp();
  const { currentRoute } = useRouter();

  const pageLanguage = computed(() => {
    const lang = currentRoute.value.query.lang as string | undefined;

    if (lang === 'en' || lang === 'hy') {
      return lang;
    }

    return 'hy';
  });

  const submitSatisfactionScore = async () => {
    const { serviceId, channel, institutionId, transactionId } = currentRoute.value.query;

    if (!serviceId) return;

    const body = {
      id: satisfactionScoreForm.id,
      rating: satisfactionScoreForm.rating,
      comment: satisfactionScoreForm.comment,
      commentSubmitted: satisfactionScoreForm.commentSubmitted,
      pageLanguage: pageLanguage.value,
      serviceId,
      serviceProvisionChannel: channel,
      institutionId,
      transactionId,
      userAgent: navigator.userAgent,
    } as SatisfactionScoreRequest;

    const { data, error } = await $useNPSApi('/v1/satisfaction').post(body).json<SatisfactionScoreResponse>();

    if (!data.value || error.value) {
      return;
    }

    satisfactionScoreForm.id = data.value.id;
  };

  return {
    // Feedback
    satisfactionScoreForm,
    submitSatisfactionScore,
  };
};
