import { loadAndRender, getSplittedHash } from "./utils.js";
export async function loadComments() {
  const articleId = getSplittedHash()[1];

  const url = `${serverURL}/article/${articleId}/comment`;
  const data = await (await fetch(url)).json(); 
  console.log(data);

  const props = data.comments;
  loadAndRender("./js/templates/comments.mustache", props, "#comments-root");
}

export async function addNewComment() {
  const author = document.querySelector("input").value;
  const text = document.querySelector("textarea").value;
  
  if (author && text) {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author,
        text
      })
    }

    const articleId = getSplittedHash()[1];
    const url = `${serverURL}/article/${articleId}/comment`;
    await fetch(url, payload);
    loadComments();
  }
}
