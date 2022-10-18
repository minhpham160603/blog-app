import React from "react";
import articles from "./article-content";
import { Link } from "react-router-dom";
import ArticleList from "../components/ArticlesList";

export default function ArticleListPage() {
  return (
    <>
      <h1>Articles</h1>
      <ArticleList articles={articles}></ArticleList>
    </>
  );
}
