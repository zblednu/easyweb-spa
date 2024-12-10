export function getSplittedHash(url = window.location.href) {
  const hashPart = url.split("#")[1];
  return hashPart ? hashPart.split("/") : [];
}

export async function loadTemplate(path) {
  const url = `${window.templatesFolder}/${path}.mustache`;
  console.log(url);
  const template = await fetch(url).then(
    response => response.text()
  );
  return template;
}

export function renderToDOM(template, props, root, append = false) {
  if (!template) {
    console.error("Template isn't loaded");
    return;
  }

  const rootElement = document.querySelector(root);
  if (!rootElement) {
    console.error(`Root ${root} doesn't exist`);
    return;
  }

  const renderedHTML = Mustache.render(template, props);
  rootElement.innerHTML = append
    ? rootElement.innerHTML + renderedHTML
    : renderedHTML;
}

