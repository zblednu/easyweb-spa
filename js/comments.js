import { getSplittedHash, loadTemplate, renderToDOM } from "./utils.js";

let throttle = false;

function hasScrolledToBottom() {
  const isBottom = Math.abs(document.documentElement.scrollHeight - 
    document.documentElement.scrollTop - 
    document.documentElement.clientHeight
  ) <= 1;
  const isArticle = getSplittedHash()[0] === "article";

  const res = isBottom && isArticle;

  if (res && !throttle) {
    throttle = true;
    setTimeout(() => throttle = false, 500);
    return res;
  }
  return false;
}

window.loadComments = async function() {
  if (hasScrolledToBottom()) {
    const template = await loadTemplate("comments");
    const articleId = getSplittedHash()[1];

    const url = `${serverURL}/article/${articleId}/comment?offset=${window.commentsLoaded}&max=5`;
    const props = {
      comments: (await fetch(url).then(res => res.json())).comments
    };

    renderToDOM(template, props, "#comments-root", true);
    window.commentsLoaded += props.comments.length;
  }
}

window.postComment = async function() {
  const author = document.querySelector("#username").value;
  const text = document.querySelector("#comment-content").value;

  if (author && text) {
    const articleId = getSplittedHash()[1];
    const url = `${serverURL}/article/${articleId}/comment`;
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

    await fetch(url, payload);
    loadComments();
    document.querySelector("#username").value = "";
    document.querySelector("#comment-content").value = "";
  }
}
