import { loadAndRender, getSplittedHash } from "./utils.js";
import { loadComments, addNewComment } from "./commentsHandler.js";

export default function(event) {

  const oldHash = getSplittedHash(event.oldURL);

  (routes[getSplittedHash()[0]] || routes[404])(oldHash)
    .catch(routes[404]);
}

const routes = {
  "search": async function() {
    const currentPage = Number(getSplittedHash()[1]);
    const offset = 20 * (currentPage - 1);
    const url = `${serverURL}/articles?max=20&offset=${offset}`;

    const data = {
      articles: (await (await fetch(url)).json()).articles
    };

    const promises = data.articles.map(elem => {
      return fetch(`${serverURL}/article/${elem.id}`)
        .then(response => response.json())
        .then(article => elem.content = article.content);
    });
    await Promise.all(promises);

    if (currentPage > 1) {
      data.prevPage = currentPage - 1;
    }
    if (currentPage < 10) {
      data.nextPage = currentPage + 1;
    }

    loadAndRender("./js/templates/search.mustache", data);
  },

  "article": async function(oldHash) {
    const articleId = getSplittedHash()[1];
    const url = `${serverURL}/article/${articleId}`;
    const data = await (await fetch(url)).json();
    data.backHref = oldHash.join("/");
    data.articleId = articleId;

    const published = new Date(data.dateCreated);
    data.published = published.toDateString().split(" ").slice(1).join(" ");
    await loadAndRender("./js/templates/article.mustache", data);

    const button = document.querySelector("button");
    button.addEventListener("click", async () => {
      await fetch(url, { method: "DELETE" });
      window.location.hash = data.backHref;
    });

    const addCommentBtn = document.querySelector("#add-comment");
    addCommentBtn.addEventListener("click", addNewComment);
    loadComments();
  },


  "edit": async function(oldHash) {
    const props = {};
    const articleId = getSplittedHash()[1];
    if (articleId !== "new") {
      const article = await (await fetch(`${serverURL}/article/${articleId}`)).json();
      props.exists = true;
      props.author = article.author;
      props.title = article.title;
      props.content = article.content;
    }

    loadAndRender("./js/templates/edit.mustache", props)
      .then(() => {
        if (articleId !== "new") {
          document.querySelector("textarea").value = props.content;
        }
      });
  },

  "404": async function() {
    loadAndRender("./js/templates/404.mustache");
  }
}
