import "./mustache.js";

export default async function loadAndRender(templatePath, props, elemId = "main") {
  const template = await (await fetch(templatePath)).text();
  const rendered = Mustache.render(template, props);

  document.querySelector(elemId).innerHTML = rendered;
}

export function a() {
  console.log("PINGER");
}
