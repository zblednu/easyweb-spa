import handleHashChange, { a } from "./router.js"
a();

window.addEventListener("hashchange", handleHashChange);

window.location.hash = "#about";
