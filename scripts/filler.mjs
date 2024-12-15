import { accessSync, constants as fsac, readFileSync } from "node:fs";

const path = "articles.json";

try {
  accessSync("articles.json", fsac.R_OK);
} catch (err) {
  console.log("can't read from articles.json:");
  console.log(err);
}

const data = readFileSync(path, "utf-8");
const articles = JSON.parse(data);

const serverURL = "http://wt.kpi.fei.tuke.sk/api/article";

const comments = Array(20).fill(null).map((elem, idx) => ({"text": "that is a placeholder comment", "author": `person ${idx + 1}`}));

articles.forEach(async elem => {
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(elem)
  };

  const articleId = await (fetch(serverURL, payload)
    .then(res => {
      console.log(res.status);
      return res.json();
    })
    .then(article => article.id)
  );

  comments.forEach(elem => {
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(elem)
    }
    fetch(`${serverURL}/${articleId}/comment`, payload)
      .then(res => console.log("comment: " + res.status));
  });
});
