import { loadTemplate, renderToDOM, getSplittedHash } from "./utils.js";
import routes from "./routes.js";

const errorRoute = routes.find(elem => elem.route === "error");

export default async function route() {
  const hash = getSplittedHash()[0];
  const route = routes.find(elem => elem.route === getSplittedHash()[0]) || errorRoute;
  if (!route.template) {
    route.template = await loadTemplate(route.route);
  }

  const props = await route.buildProps(event);
  const root = "main";
  renderToDOM(route.template, props, root);
}
