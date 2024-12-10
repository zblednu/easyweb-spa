import { getSplittedHash } from "./utils.js";
import route from "./router.js"

window.serverURL = "https://wt.kpi.fei.tuke.sk/api";
window.templatesFolder = "./mustache-templates";
window.username = "";
window.lastSearchPage = 0;

window.addEventListener("hashchange", async event => {
  window.oldHash = getSplittedHash(event.oldURL);
  window.commentsLoaded = 0;
  await route();
}, { capture: true });

window.location.hash = "#about"
