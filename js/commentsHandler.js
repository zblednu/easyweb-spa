import { getSplittedHash } from "./utils.js";

const template = await (await fetch("./js/templates/comments.mustache")).text();

export async function loadComments() {
  const articleId = getSplittedHash()[1];

  const url = `${serverURL}/article/${articleId}/comment`;
  const data = {
    comments: (await fetch(url).then(res => res.json())).comments
  }
  data.commentsAmount = data.comments.length;

  const render = Mustache.render(template, data);
  document.querySelector("#comments-root").innerHTML = render;
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
