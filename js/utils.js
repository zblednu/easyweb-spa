import routes from "./routes.js";

export function getSplittedHash(url = window.location.href) {
  const hashPart = url.split("#")[1];

  return hashPart ? hashPart.split("/") : [];
}

export function handleHashChange(event) {
  window.oldHash = getSplittedHash(event.oldURL);
  window.commentsLoaded = 0;

  const errorRoute = routes.find(item => item.route === "404");
  const route = routes.find(item => item.route === getSplittedHash()[0]) || errorRoute;

  route.handler()
    .catch(errorRoute);
}

