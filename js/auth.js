import { loadTemplate, renderToDOM } from "./utils.js";
let loggedInTemplate;
let loggedOutTemplate;
let googleScriptElem;
const root = "#auth-root";

window.handleLogIn = async function(response) {
  const token = response.credential;
  const base64Url = token.split('.')[1]; // Extract payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  const payload = JSON.parse(jsonPayload);
  window.username = payload.name;

  if (!loggedInTemplate) {
    loggedInTemplate = await loadTemplate("logged-in");
  }
  renderToDOM(loggedInTemplate, { username: window.username }, root);
  googleScriptElem.remove();
}

window.handleLogOut = async function() {
  googleScriptElem = document.createElement("script");
  googleScriptElem.src = "https://accounts.google.com/gsi/client"
  document.body.appendChild(googleScriptElem);

  window.username = "";
  if (!loggedOutTemplate) {
    loggedOutTemplate = await loadTemplate("logged-out");
  }
  renderToDOM(loggedOutTemplate, {}, root);
}

