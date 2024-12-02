import handleHashChange from "./router.js";
import uploadArticle from "./editHandler.js";

window.uploadArticle = uploadArticle;

window.serverURL = "https://wt.kpi.fei.tuke.sk/api";
window.addEventListener("hashchange", handleHashChange);

window.location.hash = "#about";
