import loadAndRender, { a } from "./utils.js"

export { a };

export default {
  "search": async function() {
    const currentPage = Number(window.location.hash.substring(1).split("/")[1]);
    const offset = 10 * (currentPage - 1);
    const url = `https://wt.kpi.fei.tuke.sk/api/article?max=10&offset=${offset}`;

    const data = await (await fetch(url)).json();
    if (currentPage > 1) {
      data.prevPage = currentPage - 1;
    }

    if (currentPage < 10) {
      data.nextPage = currentPage + 1;
    }

    loadAndRender("./js/templates/search.mustache", data);
  },

  "article": async function(event) {
    const articleId = Number(window.location.hash.substring(1).split("/")[1]);
    const url = `https://wt.kpi.fei.tuke.sk/api/article/${articleId}`;
    const data = await (await fetch(url)).json();
    data.backHref = event.oldURL.substring(event.oldURL.indexOf("#"));

    await loadAndRender("./js/templates/article.mustache", data);

    const button = document.querySelector("button");
    button.addEventListener("click", async () => {
      await fetch(url, { method: "DELETE" });
      window.location.hash = data.backHref;
    });
  },
  "404": async function() {
    loadAndRender("./js/templates/404.mustache");
  }
}
