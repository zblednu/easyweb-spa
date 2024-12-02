import { loadAndRender, getSplittedHash } from "./utils.js";

export default function(event) {

  const oldHash = getSplittedHash(event.oldURL);

  (routes[getSplittedHash()[0]] || routes[404])(oldHash)
    .catch(routes[404]);
}

const routes = {
  "search": async function() {
    const currentPage = getSplittedHash()[1];
    const offset = 10 * (currentPage - 1);
    const url = `${serverURL}/articles?max=10&offset=${offset}`;

    const data = {};
    data.articles = (await (await fetch(url)).json()).articles;
    for (const item of data.articles) {
      item.content = (await(await fetch(`${serverURL}/article/${item.id}`)).json()).content;
    }
    if (currentPage > 1) {
      data.prevPage = currentPage - 1;
    }

    if (currentPage < 10) {
      data.nextPage = currentPage + 1;
    }

    console.log(data);
    loadAndRender("./js/templates/search.mustache", data);
  },

  "article": async function(oldHash) {
    const articleId = getSplittedHash()[1];
    const url = `${serverURL}/article/${articleId}`;
    const data = await (await fetch(url)).json();
    data.backHref = oldHash.join("/");
    data.articleId = articleId;

    await loadAndRender("./js/templates/article.mustache", data);

    const button = document.querySelector("button");
    button.addEventListener("click", async () => {
      await fetch(url, { method: "DELETE" });
      window.location.hash = data.backHref;
    });
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
