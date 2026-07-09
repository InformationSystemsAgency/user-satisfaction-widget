interface SatisfactionThumbsRequest {
  id?: string;
  serviceId: string;
  pageName?: string;
  serviceProvisionChannel?: string | null;
  institutionId?: string | null;
  transactionId?: string | null;
  rating?: number;
  comment?: string;
  commentSubmitted?: boolean;
  userAgent?: string;
  pageLanguage?: string;
}

interface SatisfactionThumbsResponse {
  id: string;
  pageId?: string;
  skipped?: boolean;
  pageUpdated?: boolean;
}

const getPageNameFromDomain = () => {
  const resolvePageName = (url: URL) => {
    const path = url.pathname === '/' ? '' : url.pathname;
    return `${url.origin}${path}`;
  };

  if (document.referrer) {
    try {
      return resolvePageName(new URL(document.referrer));
    } catch {
      // ignore invalid referrer URL
    }
  }

  return resolvePageName(new URL(window.location.href));
};

const satisfactionScoreForm = reactive<{
  id?: string;
  rating?: number;
  comment: string;
  commentSubmitted: boolean;
}>({
  comment: '',
  commentSubmitted: false,
});

export const useThumbsFeedback = () => {
  const { $useNPSApi } = useNuxtApp();
  const { currentRoute } = useRouter();

  const pageLanguage = computed(() => {
    const lang = currentRoute.value.query.lang as string | undefined;

    if (lang === 'en' || lang === 'hy' || lang === 'ru') {
      return lang;
    }

    return 'hy';
  });

  const submitSatisfactionScore = async () => {
    if (!satisfactionScoreForm.rating) return;

    const { serviceId, channel, institutionId, transactionId } = currentRoute.value.query;

    if (!serviceId) return;

    const pageName = getPageNameFromDomain();

    const body = {
      id: satisfactionScoreForm.id,
      serviceId: serviceId as string,
      pageName,
      rating: satisfactionScoreForm.rating,
      comment: satisfactionScoreForm.comment,
      commentSubmitted: satisfactionScoreForm.commentSubmitted,
      serviceProvisionChannel: channel as string | undefined,
      institutionId: institutionId as string | undefined,
      transactionId: transactionId as string | undefined,
      userAgent: navigator.userAgent,
      pageLanguage: pageLanguage.value,
    } as SatisfactionThumbsRequest;

    const { data, error } = await $useNPSApi('/v1/satisfaction-thumbs').post(body).json<SatisfactionThumbsResponse>();

    if (!data.value || error.value) {
      return;
    }

    if (data.value.pageId) {
      satisfactionScoreForm.id = data.value.pageId;
    }
  };

  const cancelFeedback = () => {
    satisfactionScoreForm.rating = undefined;
    satisfactionScoreForm.comment = '';
    satisfactionScoreForm.commentSubmitted = false;
  };

  return {
    satisfactionScoreForm,
    submitSatisfactionScore,
    cancelFeedback,
  };
};
