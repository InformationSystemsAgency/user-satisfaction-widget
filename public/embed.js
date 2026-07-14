(function () {
  var PAGE_URL_REQUEST = 'satisfaction-thumbs:get-page-url';
  var PAGE_URL_RESPONSE = 'satisfaction-thumbs:page-url';
  var RESIZE = 'satisfaction-thumbs:resize';
  var IFRAME_SELECTOR = '#satisfaction-thumbs, iframe[data-satisfaction-thumbs]';

  function getPageUrl() {
    return window.location.origin + window.location.pathname + window.location.search;
  }

  function getIframe() {
    return document.querySelector(IFRAME_SELECTOR);
  }

  function setIframeHeight(height) {
    var iframe = getIframe();
    if (iframe && typeof height === 'number') {
      iframe.style.height = height + 'px';
    }
  }

  function syncPageNameToIframeSrc() {
    var iframe = getIframe();
    if (!iframe || !iframe.src) return;

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

  window.addEventListener('message', onMessage);
  window.addEventListener('popstate', onNavigation);

  patchHistory('pushState');
  patchHistory('replaceState');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncPageNameToIframeSrc);
  } else {
    syncPageNameToIframeSrc();
  }
})();
