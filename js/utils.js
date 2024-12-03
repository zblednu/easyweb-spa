export function getSplittedHash(url = window.location.href) {
  try {
    return url.split("#")[1].split("/");
  } catch (err) {
    return "";
  }
}
