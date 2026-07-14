(function () {
  var PAGE_URL_REQUEST = 'satisfaction-thumbs:get-page-url';
  var PAGE_URL_RESPONSE = 'satisfaction-thumbs:page-url';
  var RESIZE = 'satisfaction-thumbs:resize';
  var RESIZE_REQUEST = 'satisfaction-thumbs:request-resize';
  var IFRAME_SELECTOR = '#satisfaction-thumbs, iframe[data-satisfaction-thumbs]';

  function getPageUrl() {
    return window.location.origin + window.location.pathname + window.location.search;
  }

  function getIframe() {
    return document.querySelector(IFRAME_SELECTOR);
  }

  function applyIframeBaseStyles(iframe) {
    if (!iframe) return;

    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.border = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.verticalAlign = 'bottom';
  }

  function setIframeHeight(height) {
    var iframe = getIframe();
    if (!iframe || typeof height !== 'number' || height <= 0) return;

    applyIframeBaseStyles(iframe);
    iframe.style.height = Math.ceil(height) + 'px';
  }

  function requestIframeHeight() {
    var iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;

    applyIframeBaseStyles(iframe);
    iframe.contentWindow.postMessage({ type: RESIZE_REQUEST }, '*');
  }

  function syncPageNameToIframeSrc() {
    var iframe = getIframe();
    if (!iframe || !iframe.src) return;

    applyIframeBaseStyles(iframe);

    try {
      var url = new URL(iframe.src, window.location.href);
      var nextPageName = getPageUrl();

      if (url.searchParams.get('pageName') === nextPageName) return;

      url.searchParams.set('pageName', nextPageName);
      iframe.src = url.toString();
    } catch (error) {
      // ignore invalid iframe src
    }
  }

  function onMessage(event) {
    if (!event.data) return;

    if (event.data.type === PAGE_URL_REQUEST) {
      event.source && event.source.postMessage({ type: PAGE_URL_RESPONSE, url: getPageUrl() }, '*');
      return;
    }

    if (event.data.type === RESIZE) {
      setIframeHeight(event.data.height);
    }
  }

  function onNavigation() {
    syncPageNameToIframeSrc();
  }

  function patchHistory(method) {
    var original = history[method];

    history[method] = function () {
      var result = original.apply(this, arguments);
      onNavigation();
      return result;
    };
  }

  function watchForIframe() {
    var iframe = getIframe();

    var bindIframe = function (el) {
      applyIframeBaseStyles(el);
      syncPageNameToIframeSrc();
      requestIframeHeight();

      el.addEventListener('load', function () {
        requestIframeHeight();
      });
    };

    if (iframe) {
      bindIframe(iframe);
      return;
    }

    if (typeof MutationObserver === 'undefined') return;

    var observer = new MutationObserver(function () {
      var found = getIframe();
      if (!found) return;

      bindIframe(found);
      observer.disconnect();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  window.addEventListener('message', onMessage);
  window.addEventListener('popstate', onNavigation);

  patchHistory('pushState');
  patchHistory('replaceState');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchForIframe);
  } else {
    watchForIframe();
  }
})();
