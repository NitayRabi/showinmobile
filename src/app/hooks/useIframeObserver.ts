import { useEffect } from "react";
const haltBrowser = (milliseconds) => {
  const start = Date.now();
  while (Date.now() - start < milliseconds) {
    // Busy-wait loop: does nothing but consume CPU until time is up
  }
};

function useIframeObserver(containerRef, src) {
  const injectedIframes = new Set();

  const extractBaseUrlWithProtocolFromFullURL = (fullURL: string) => {
    try {
      const url = new URL(fullURL.replace("api/proxy?url=", ""));
      return "api/proxy?url=" + url.origin;
    } catch {
      return fullURL;
    }
  };
  const injectScript = (iframeWindow) => {
    const body = iframeWindow.document.body;
    const head = iframeWindow.document.head;
    if (!iframeWindow || body === null) {
      return;
    }

    console.log(
      "Injecting script into iframe window:",
      iframeWindow.document.body,
      iframeWindow
    );
    // injectedIframes.add(iframeWindow); // Mark iframe as injected

    const script = iframeWindow.document.createElement("script");
    script.type = "text/javascript";
    const scriptContent = `(function() {
         const topOrigin = '${window.location.origin}';
            const originalFetch = window.fetch;
         console.log("Hello, World!", topOrigin);
               window.fetch = function(...args) {
              console.log('Fetch called with arguments:', args);
              const url = args[0];

              return originalFetch.apply(this, args);
          };

          const originalXhrOpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(...args) {
              console.log('XHR opened with arguments:', args);
                const url = args[1];
                console.log(
                    'URL before modification:',
                    url,
                    'Top origin:',
                    topOrigin,
                    url.startsWith('/'), url.startsWith(topOrigin), url.includes('proxy')
                )
                const modifiedUrl = url.startsWith('/') ? topOrigin + '/${extractBaseUrlWithProtocolFromFullURL(
                  src
                )}' + url : url;
                console.log('Modified URL:', modifiedUrl);
              return originalXhrOpen.apply(this, [args[0], modifiedUrl, args[2]]);
          };
         const interceptScriptLoad = (element) => {
              if (element.tagName === "SCRIPT" && element.src) {

                  console.log("Script with src intercepted:", element.src);
              }
          };
          // Override appendChild and insertBefore
          const originalAppendChild = Element.prototype.appendChild;
          Element.prototype.appendChild = function(element) {
              interceptScriptLoad(element);
              if (element.tagName === "SCRIPT" && element.src) {
                if (element.src.startsWith(topOrigin) && !element.src.includes('proxy')) {
                    console.log("Rewriting", element.src);
                    element.src = element.src.replace(topOrigin, topOrigin + '/${extractBaseUrlWithProtocolFromFullURL(
                      src
                    )}');
                }
              }
               return originalAppendChild.call(this, element);
          };

          const originalInsertBefore = Element.prototype.insertBefore;
          Element.prototype.insertBefore = function(element, referenceNode) {
              interceptScriptLoad(element);
              if (element.tagName === "SCRIPT" && element.src) {
                if (element.src.startsWith(topOrigin) && !element.src.includes('proxy')) {
                    console.log("Script with src intercepted:", element.src);
                    element.src = element.src.replace(topOrigin, topOrigin + '/${extractBaseUrlWithProtocolFromFullURL(
                      src
                    )}');
                }
              }
               return originalInsertBefore.call(this, element, referenceNode);
            
          };
})();`;
    script.innerHTML = scriptContent;
    head.prepend(script);
    console.log("Script injected into iframe window:", iframeWindow);

    // while (!scriptLoaded) {
    //   console.log("Waiting for script to load...");
    //   script.onload = () => {
    //     scriptLoaded = true;
    //   };
    //   setTimeout(() => {
    //     scriptLoaded = true;
    //   }, 1000);
    // }
  };

  const observeIframeForNestedIframes = (iframeWindow) => {
    if (!iframeWindow || !iframeWindow.document) return;
    const iframeDocument = iframeWindow.document;
    console.log("Observing iframe for nested iframes:", iframeWindow);

    const startObserving = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === "IFRAME") {
              console.log("Nested iframe added:", node);
              attachIframeLoadHandler(node);
            }
          });
        });
      });

      observer.observe(iframeDocument.body, { childList: true, subtree: true });
      iframeWindow.addEventListener("unload", () => observer.disconnect());

      const existingIframes =
        iframeDocument.body.getElementsByTagName("iframe");
      console.log("Existing iframes in iframe:", existingIframes);
      for (const iframe of existingIframes) {
        if (iframe.contentWindow) {
          injectScript(iframe.contentWindow);
          observeIframeForNestedIframes(iframe.contentWindow);
        } else {
          attachIframeLoadHandler(iframe);
        }
      }
    };

    if (iframeDocument.body) {
      startObserving();
    } else {
      iframeDocument.addEventListener("DOMContentLoaded", startObserving, {
        once: true,
      });
    }
  };

  const attachIframeLoadHandler = (iframe) => {
    const injectAndObserve = () => {
      try {
        if (iframe.contentWindow) {
          injectScript(iframe.contentWindow);
          observeIframeForNestedIframes(iframe.contentWindow);
        }
      } catch (error) {
        console.error("Could not inject script into iframe:", error);
      }
    };
    iframe.addEventListener("DOMContentLoaded", injectAndObserve, {
      once: true,
    });
    iframe.onload = injectAndObserve;

    if (
      iframe.contentWindow &&
      iframe.contentWindow.document.readyState === "complete"
    ) {
      injectAndObserve();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "IFRAME") {
            console.log("Iframe added:", node);
            attachIframeLoadHandler(node);
          }
        });
      });
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    const existingIframes = containerRef.current.getElementsByTagName("iframe");
    console.log("Existing iframes:", existingIframes);
    for (const iframe of existingIframes) {
      attachIframeLoadHandler(iframe);
    }

    return () => observer.disconnect();
  }, [containerRef]);
}

export default useIframeObserver;
