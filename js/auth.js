const signInButton = document.querySelector(".g_id_signin");
const logOutPrompt = document.querySelector("#logout-prompt");
const usernameField = document.querySelector("#username-field");

export function handleAuth(response) {
  window.authToken = response.credential;
  const payload = JSON.parse(atob(authToken.split(".")[1]));
  window.username = payload.given_name + payload.family_name;
  usernameField.textContent = username;

  signInButton.hidden = true;
  logOutPrompt.hidden = false;

}

export function handleLogOut() {
  signInButton.hidden = false;
  logOutPrompt.hidden = true;
  window.username = "";
}

