export function getSplittedHash(url = window.location.href) {
  return url.split("#")[1].split("/");
}
