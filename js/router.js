import routes, { a } from "./routes.js"

export { a };

export default function(event) {
  const hash = window.location.hash.substring(1).split("/")[0];

  (routes[hash] || routes[404])(event);
}
