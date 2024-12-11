import { getSplittedHash, loadTemplate } from "./utils.js";

export default [
  {
    route: "about",
    buildProps: () => {}
  },
  {
    route: "search",
    buildProps: async function() {
      window.lastSearchPage = Number(getSplittedHash()[1]);

      const props = {};
      const articlesPerPage = 5;
      const offset = articlesPerPage * lastSearchPage;
      let totalCount;

      await fetch(`${serverURL}/articles?max=${articlesPerPage}&offset=${offset}&tag=easyweb`)
        .then(res => res.json())
        .then(data => {
          totalCount = data.meta.totalCount;
          props.articles = data.articles;
        })

      if (lastSearchPage > 0) {
        props.prevSearchPage = String(lastSearchPage - 1);
      }
      if (lastSearchPage < Math.ceil(totalCount / articlesPerPage) - 1) {
        props.nextSearchPage = String(lastSearchPage + 1);
      }

      const previewPromises = props.articles.map(elem => {
        return fetch(`${serverURL}/article/${elem.id}`)
          .then(response => response.json())
          .then(article => elem.preview = article.content);
      });
      await Promise.all(previewPromises);

      return props;
    }
  },
  {
    route: "article",
    buildProps: async function() {
      const articleId = getSplittedHash()[1];
      const props = await fetch(`${serverURL}/article/${articleId}`)
        .then(res => res.json());

      props.username = window.username;
      props.backHref = `search/${lastSearchPage}`;
      const published = new Date(props.dateCreated);
      props.published = published.toDateString().split(" ").slice(1).join(" ");

      return props;
    }
  },
  {
    route: "edit",
    buildProps: async function() {
      const props = {};
      props.backHref = window.oldHash.join("/");
      const articleId = getSplittedHash()[1];
      props.articleExists = articleId !== "new";
      props.author = window.username;

      if (props.articleExists) {
        await fetch(`${serverURL}/article/${articleId}`)
          .then(res => res.json())
          .then(article => {
            props.author = article.author;
            props.title = article.title;
            props.content = article.content;
          });
      }

      return props;
    }
  }
]
