/** Constants both Server and Client Components need. (A value exported from a "use client" file reaches a Server
 *  Component as a client reference, not the value.) */
export const CONTACT_PANEL_ID = "contact-panel";

/** Runs in <head> before first paint: applies the theme the visitor picked (data-theme on <html>); without a stored
 *  choice the OS setting decides, in CSS. */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/** Media query for the hero page curl (`PageCurl`), wherever the hero fits one screen: wide and tall enough (it turns
 *  sideways), or narrow with the computer as a backdrop (it flips up). Keep in step with the @media rule in globals.css. */
export const CURL_MEDIA =
  "(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (min-height: 46rem), (prefers-reduced-motion: no-preference) and (max-width: 63.98rem) and (min-height: 34rem)";

/** Runs in <head> before first paint: on the home page, where the page curl will run, marks <html> with data-curl so
 *  the layout for it (sticky hero, About underneath) is in place from the start, with no jump on hydration. */
export const curlScript = `(function(){try{if(location.pathname==="/"&&matchMedia(${JSON.stringify(CURL_MEDIA)}).matches)document.documentElement.setAttribute("data-curl","")}catch(e){}})()`;

/** Runs in <head> before first paint: shows the intro (data-intro on <html>) on the home page, once per session, not
 *  with reduced motion, data saver or for crawlers. Removes it after 14s even if the app's JS never loads, so the
 *  page can't stay covered. `/?intro=1` forces it (to replay or demo it). */
export const introScript = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;var f=/[?&]intro=1/.test(location.search);if(!f){if(sessionStorage.getItem("intro-seen"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var c=navigator.connection;if(c&&c.saveData)return;if(/bot|crawl|spider|slurp|lighthouse|preview|headless/i.test(navigator.userAgent))return}d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},14000)}catch(e){}})()`;
