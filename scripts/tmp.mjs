import { readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

const prompts = ["title: ", "content: "];
let isContent = false;
const articleData = {};
const newArticles = [];
console.log(prompts[Number(isContent)]);

process.stdin.on("data", chunk => {
  const data = chunk.toString().trim();
  if (isContent) {
    articleData.content = data;
    newArticles.push(new Article(articleData.title, articleData.content));
  }
  else {
    articleData.title = data;
  }

  isContent = !isContent;
  console.log(prompts[Number(isContent)]);
});

process.on("SIGINT", () => {
  const data = readFileSync("articles.json", "utf-8");
  const oldArticles = JSON.parse(data);
  oldArticles.push(...newArticles);
  writeFileSync("articles.json", JSON.stringify(oldArticles), "utf-8");

  process.exit();
});

const author = "Easyweb";
const tags = ["easyweb"];

function Article(title, content) {
  this.title = title;
  this.content = content;
  this.author = author;
  this.tags = tags;
}

