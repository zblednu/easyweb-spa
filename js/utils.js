export async function loadAndRender(templatePath, props, elemId = "main") {
  const template = await (await fetch(templatePath)).text();
  const rendered = Mustache.render(template, props);

  document.querySelector(elemId).innerHTML = rendered;
}

export function getSplittedHash(url = window.location.href) {
  return url.split("#")[1].split("/");
}
