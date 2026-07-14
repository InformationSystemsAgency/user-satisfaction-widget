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

const PAGE_URL_REQUEST_TYPE = 'satisfaction-thumbs:get-page-url';
const PAGE_URL_RESPONSE_TYPE = 'satisfaction-thumbs:page-url';

const decodeQueryValue = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const resolvePageName = (url: URL) => {
  const path = url.pathname === '/' ? '' : url.pathname;
  const search = url.search || '';
  return `${url.origin}${path}${search}`;
};

const isFullUrl = (pageName: string) => {
  try {
    new URL(pageName);
    return true;
  } catch {
    return false;
  }
};

const isOriginOnly = (pageName: string) => {
  if (!isFullUrl(pageName)) return false;

  try {
    const url = new URL(pageName);
    return url.pathname === '/' && !url.search;
  } catch {
    return false;
  }
};

const isPathnameOnly = (pageName: string) => pageName.startsWith('/');

const getReferrerOrigin = () => {
  if (!document.referrer) return undefined;

  try {
    return new URL(document.referrer).origin;
  } catch {
    return undefined;
  }
};

const withParentOrigin = (pathname: string, origin: string) => `${origin}${pathname}`;

const getPageNameFromReferrer = () => {
  if (!document.referrer) return undefined;

  try {
    const url = new URL(document.referrer);
    if (url.pathname === '/' && !url.search) return undefined;
    return resolvePageName(url);
  } catch {
    return undefined;
  }
};

const requestParentPageUrl = () =>
  new Promise<string | undefined>(resolve => {
    if (typeof window === 'undefined' || window.parent === window) {
      resolve(undefined);
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== PAGE_URL_RESPONSE_TYPE || typeof event.data.url !== 'string') return;

      window.removeEventListener('message', onMessage);
      clearTimeout(timeoutId);
      resolve(event.data.url);
    };

    const timeoutId = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      resolve(undefined);
    }, 500);

    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: PAGE_URL_REQUEST_TYPE }, '*');
  });

const resolveParentPageName = (parentUrl: string) => {
  try {
    return resolvePageName(new URL(parentUrl));
  } catch {
    return parentUrl;
  }
};

const getPageName = async (queryPageName?: string | null) => {
  const fromParent = await requestParentPageUrl();

  if (typeof queryPageName === 'string' && queryPageName && !isOriginOnly(queryPageName)) {
    if (isFullUrl(queryPageName)) {
      return queryPageName;
    }

    if (isPathnameOnly(queryPageName)) {
      if (fromParent) {
        return resolveParentPageName(fromParent);
      }

      const referrerOrigin = getReferrerOrigin();
      if (referrerOrigin) {
        return withParentOrigin(queryPageName, referrerOrigin);
      }
    }

    return queryPageName;
  }

  if (fromParent) {
    return resolveParentPageName(fromParent);
  }

  const fromReferrer = getPageNameFromReferrer();
  if (fromReferrer) return fromReferrer;

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

  const pageNameFromQuery = computed(() => {
    const { pageName, pageUrl } = currentRoute.value.query;
    const value = (typeof pageName === 'string' && pageName) || (typeof pageUrl === 'string' && pageUrl) || '';

    return value ? decodeQueryValue(value) : '';
  });

  watch(pageNameFromQuery, (nextPageName, previousPageName) => {
    if (nextPageName && previousPageName && nextPageName !== previousPageName) {
      satisfactionScoreForm.id = undefined;
      satisfactionScoreForm.rating = undefined;
      satisfactionScoreForm.comment = '';
      satisfactionScoreForm.commentSubmitted = false;
    }
  });

  const submitSatisfactionScore = async () => {
    if (!satisfactionScoreForm.rating) return;

    const { serviceId, channel, institutionId, transactionId } = currentRoute.value.query;

    if (!serviceId) return;

    const resolvedPageName = await getPageName(pageNameFromQuery.value || null);

    const body = {
      id: satisfactionScoreForm.id,
      serviceId: serviceId as string,
      pageName: resolvedPageName,
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
