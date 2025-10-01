"use client";
/**
 * Blocks client-side redirects for LOGGED-OUT visitors only.
 * No visual changes to your page; just prevents flicker.
 * Toggle via NEXT_PUBLIC_BLOCK_GUEST_REDIRECTS=1
 */
(function () {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_BLOCK_GUEST_REDIRECTS !== "1") return;

  var c = document.cookie || "";
  var hasSession =
    c.includes("next-auth.session-token") ||
    c.includes("__Secure-next-auth.session-token") ||
    c.includes("authjs.session-token");

  if (hasSession) return; // logged-in → allow redirects

  // Block History API navigations (used by Next App Router)
  try {
    var H = window.history;
    var _push = H.pushState.bind(H);
    var _replace = H.replaceState.bind(H);
    H.pushState = function (state, title, url) {
      console.warn("[guest-shield] pushState blocked:", url);
      return state; // do NOT navigate
    };
    H.replaceState = function (state, title, url) {
      console.warn("[guest-shield] replaceState blocked:", url);
      return state; // do NOT navigate
    };
  } catch (e) { /* noop */ }

  // Block hard navigations
  try {
    var _assign = window.location.assign.bind(window.location);
    var _repl = window.location.replace.bind(window.location);
    window.location.assign = function (url) {
      console.warn("[guest-shield] location.assign blocked:", url);
    };
    window.location.replace = function (url) {
      console.warn("[guest-shield] location.replace blocked:", url);
    };
    // Block setting location.href directly
    var proto = Object.getPrototypeOf(window.location) || window.Location && window.Location.prototype;
    var desc = proto && Object.getOwnPropertyDescriptor(proto, "href");
    if (desc && desc.configurable) {
      Object.defineProperty(window.location, "href", {
        configurable: true,
        get: function () { return desc.get.call(window.location); },
        set: function (v) { console.warn("[guest-shield] href set blocked:", v); }
      });
    }
  } catch (e) { /* noop */ }
})();
