import { getSplittedHash } from "./utils.js";

export default async function uploadArticle() {
  const author = document.querySelector("#author").value.trim();
  const title = document.querySelector("#title").value.trim();
  const content = document.querySelector("textarea").value.trim();

  if (author && title && content) {
    const articleId = getSplittedHash()[1];
    console.log(articleId);
    const payload = {
      method: articleId === "new" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        author,
        content,
        tags: ["easyweb"]
      })
    };

    const response = await (await fetch(serverURL + "/article" + (articleId !== "new" && `/${articleId}`), payload)).json();

    window.location.hash = `#article/${response.id}`;
  }

};
