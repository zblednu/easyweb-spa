
const serverURL = "http://wt.kpi.fei.tuke.sk/api/article";

const articles = await (fetch(`${serverURL}s/?max=1000&tag=easyweb`)
  .then(res => res.json())
  .then(data => {
    data.articles.forEach(elem => {
      const payload = {
        method: "DELETE"
      }
      fetch(`${serverURL}/${elem.id}`, payload);
    });
  })
);

