import { getSplittedHash } from "./utils.js";

window.uploadArticle = async function() {
  const author = document.querySelector("#author").value.trim();
  const title = document.querySelector("#title").value.trim();
  const content = document.querySelector("#content").value.trim();

  if (author && title && content) {
    const articleId = getSplittedHash()[1];
    const articleExists = articleId !== "new";
    const url = serverURL + "/article" + (articleId !== "new" && `/${articleId}`);
    const payload = {
      method: articleExists ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        author,
        content,
        tags: articleExists ? undefined : ["easyweb"]
      })
    };

    const response = await (fetch(url, payload)
      .then(res => res.json()));
    window.location.hash = `#article/${response.id}`;
  }
};

window.deleteArticle = async function() {
  const articleId = getSplittedHash()[1];
  await fetch(`${serverURL}/article/${articleId}`, {
    method: "DELETE"
  });
  window.location.hash = oldHash.join("/");
}

