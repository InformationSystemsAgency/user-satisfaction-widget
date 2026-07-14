const RESIZE_MESSAGE_TYPE = 'satisfaction-thumbs:resize';
const RESIZE_REQUEST_TYPE = 'satisfaction-thumbs:request-resize';

export const useIframeAutoHeight = (rootElement: Ref<HTMLElement | undefined>) => {
  let lastPostedHeight = 0;

  const measureHeight = () => {
    const el = rootElement.value;
    if (!el) return 0;

    return Math.ceil(el.offsetHeight);
  };

  const postHeight = (force = false) => {
    if (typeof window === 'undefined' || window.parent === window) return;

    const height = measureHeight();
    if (!height) return;
    if (!force && height === lastPostedHeight) return;

    lastPostedHeight = height;
    window.parent.postMessage({ type: RESIZE_MESSAGE_TYPE, height }, '*');
  };

  onMounted(() => {
    let resizeObserver: ResizeObserver | undefined;
    let frameId = 0;
    let retryId = 0;

    const schedulePostHeight = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => postHeight());
      });
    };

    const observe = (el: HTMLElement | undefined) => {
      resizeObserver?.disconnect();
      if (!el || typeof ResizeObserver === 'undefined') {
        schedulePostHeight();
        return;
      }

      resizeObserver = new ResizeObserver(() => schedulePostHeight());
      resizeObserver.observe(el);
      schedulePostHeight();
    };

    const onParentRequest = (event: MessageEvent) => {
      if (event.data?.type !== RESIZE_REQUEST_TYPE) return;
      postHeight(true);
    };

    window.addEventListener('message', onParentRequest);

    observe(rootElement.value);
    watch(rootElement, el => observe(el));

    // Parent listener may mount after the first resize message — retry a few times.
    let retries = 0;
    const retry = () => {
      postHeight(true);
      retries += 1;
      if (retries < 5) {
        retryId = window.setTimeout(retry, 200);
      }
    };
    retry();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => postHeight(true));
    }

    onBeforeUnmount(() => {
      cancelAnimationFrame(frameId);
      clearTimeout(retryId);
      resizeObserver?.disconnect();
      window.removeEventListener('message', onParentRequest);
    });
  });

  return { postHeight };
};
