import { getSplittedHash } from "./utils.js";
import route from "./router.js";
import "./edit.js";
import "./comments.js";
import { handleAuth, handleLogOut } from "./auth.js";

window.handleAuth = handleAuth;
window.handleLogOut = handleLogOut;
const script = document.createElement("script");
script.src = "https://accounts.google.com/gsi/client";
document.body.appendChild(script);

window.serverURL = "https://wt.kpi.fei.tuke.sk/api";
window.templatesFolder = "./mustache-templates";
window.username = "";
window.lastSearchPage = 0;
window.commentsLoaded = 0;

window.addEventListener("hashchange", async event => {
  window.oldHash = getSplittedHash(event.oldURL);
  window.commentsLoaded = 0;
  await route();
}, { capture: true });

window.location.hash = "#about"

