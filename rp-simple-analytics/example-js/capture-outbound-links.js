// Example only, you will probably want to customise this! See https://docs.simpleanalytics.com/capture-outbound-links
(function saInitializeLinkCapture(window) {
  var log = function (message, type) {
    var logger = type === "warn" ? console.warn : console.log;
    return logger("Simple Analytics: " + message);
  };

  window.saCaptureOutboundLink = function saCaptureOutboundLink(element) {
    if (!element) return log("no element found in saCaptureOutboundLink");
    var sent = false;

    var callback = function () {
      if (!sent) document.location = element.getAttribute("href");
      sent = true;
    };

    if (window.sa_event) {
      var href = element.getAttribute("href");
      var hostname = href.indexOf("://") ? href.split("/")[2] : href;
      var event =
        "outbound_" +
        hostname.replace(/[^a-z0-9]+/gi, "_").replace(/(^_+|_+$)/g, "");
      sa_event(event, callback);
      log("captured outbound link as event: " + event);

      return window.setTimeout(callback, 5000);
    } else {
      log("sa_event is not defined", "warn");
      return callback();
    }
  };

  function onDOMContentLoaded() {
    var a = document.getElementsByTagName("a");

    // Loop over all links on the page
    for (var i = 0; i < a.length; i++) {
      var link = a[i];

      // Test is a link does start with http:// or https://
      if (
        /^https?:\/\//i.test(link.href) &&
        link.hostname !== window.location.hostname
      ) {
        link.setAttribute(
          "onclick",
          "saCaptureOutboundLink(this); return false;"
        );
      }
    }
  }

  window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
})(window);
