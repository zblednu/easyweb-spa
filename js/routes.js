import { getSplittedHash } from "./utils.js";
import { loadComments, addNewComment } from "./commentsHandler.js";
import uploadArticle from "./editHandler.js";

export default [
  {
    route: "about",
    template: await (fetch("./js/templates/about.mustache")
                    .then(res => res.text())),
    handler: function() {
      const rendered = Mustache.render(this.template, {});
      document.querySelector("main").innerHTML = rendered;
    }
  },
  {
    route: "search",
    template: await (await fetch("./js/templates/search.mustache")).text(),
    handler: async function() {
      window.lastSearchPage = Number(getSplittedHash()[1]);
      const offset = 10 * (lastSearchPage - 1);
      const url = `${serverURL}/articles?max=10&offset=${offset}`;

      const data = {
        articles: (await (await fetch(url)).json()).articles
      };

      const promises = data.articles.map(elem => {
        return fetch(`${serverURL}/article/${elem.id}`)
          .then(response => response.json())
          .then(article => elem.content = article.content);
      });
      await Promise.all(promises);

      if (lastSearchPage > 1) {
        data.prevPage = lastSearchPage - 1;
      }
      if (lastSearchPage < 10) {
        data.nextPage = lastSearchPage + 1;
      }

      const rendered = Mustache.render(this.template, data);
      document.querySelector("main").innerHTML = rendered;
    }
  },
  {
    route: "article",
    template: await (await fetch("./js/templates/article.mustache")).text(),
    handler: async function() {
      const articleId = getSplittedHash()[1];
      const url = `${serverURL}/article/${articleId}`;
      const data = await (await fetch(url)).json();
      data.backHref = `search/${window.lastSearchPage}`;
      data.articleId = articleId;

      const published = new Date(data.dateCreated);
      data.published = published.toDateString().split(" ").slice(1).join(" ");
      const rendered = Mustache.render(this.template, data);
      document.querySelector("main").innerHTML = rendered;

      const button = document.querySelector("button");
      button.addEventListener("click", async () => {
        await fetch(url, { method: "DELETE" });
        window.location.hash = data.backHref;
      });

      const addCommentBtn = document.querySelector("#add-comment");
      addCommentBtn.addEventListener("click", addNewComment);

      const loadCommentsBtn = document.querySelector("#load-comments");
      loadCommentsBtn.addEventListener("click", loadComments);

      if (window.username) {
        const usernameInput = document.querySelector("#username");
        usernameInput.value = window.username;
      }
    }
  },
  {
    route: "edit",
    template: await (await fetch("./js/templates/edit.mustache")).text(),
    handler: async function() {
      const data = {};
      const articleId = getSplittedHash()[1];
      if (articleId !== "new") {
        const article = await (await fetch(`${serverURL}/article/${articleId}`)).json();
        data.exists = true;
        data.author = article.author;
        data.title = article.title;
        data.content = article.content;
      }
      data.backHref = window.oldHash.join("/");

      const rendered = Mustache.render(this.template, data);
      document.querySelector("main").innerHTML = rendered;

      document.querySelector("button").addEventListener("click", uploadArticle);

      if (!data.exists && window.username) {
        const usernameInput = document.querySelector("#author");
        usernameInput.value = window.username;
      }
    }
  },
  {
    route: "404",
    template: await (await fetch("./js/templates/404.mustache")).text(),
    handler: async function() {
      const rendered = Mustache.render(this.template, null);
      document.querySelector("main").innerHTML = rendered;
    }
  }
]
