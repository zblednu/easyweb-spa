import { getSplittedHash, handleHashChange } from "./utils.js";

window.addEventListener("hashchange", handleHashChange);

window.oldHash = [];
window.location.hash = "#about"
window.serverURL = "https://wt.kpi.fei.tuke.sk/api";
window.username = "";
window.lastSearchPage = 1;
window.commentsLoaded = 0;


