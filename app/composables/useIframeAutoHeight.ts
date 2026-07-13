const RESIZE_MESSAGE_TYPE = 'satisfaction-thumbs:resize';

export const useIframeAutoHeight = (rootElement: Ref<HTMLElement | undefined>) => {
  const postHeight = () => {
    if (typeof window === 'undefined' || window.parent === window) return;

    const height = Math.ceil(
      rootElement.value?.getBoundingClientRect().height ?? document.documentElement.scrollHeight,
    );

    window.parent.postMessage({ type: RESIZE_MESSAGE_TYPE, height }, '*');
  };

  onMounted(() => {
    let resizeObserver: ResizeObserver | undefined;

    const observe = (el: HTMLElement | undefined) => {
      resizeObserver?.disconnect();

      if (!el || typeof ResizeObserver === 'undefined') {
        postHeight();
        return;
      }

      resizeObserver = new ResizeObserver(() => postHeight());
      resizeObserver.observe(el);
      postHeight();
    };

    observe(rootElement.value);
    watch(rootElement, el => observe(el));

    onBeforeUnmount(() => {
      resizeObserver?.disconnect();
    });
  });

  return { postHeight };
};
