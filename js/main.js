import routes from "./routes.js";
import { getSplittedHash } from "./utils.js";

window.serverURL = "https://wt.kpi.fei.tuke.sk/api";
window.addEventListener("hashchange", handleHashChange);
window.lastSearchPage = 1;

function handleHashChange(event) {
  const oldHash = getSplittedHash(event.oldURL);
  const errorRoute = routes.find(item => item.route === "404");

  const route = routes.find(item => item.route === getSplittedHash()[0]) || errorRoute;
  route.handler(oldHash)
    .catch(errorRoute);
}

window.location.hash = "#search/1"
