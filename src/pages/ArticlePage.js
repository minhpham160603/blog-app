import { useState, useEffect } from "react";
import React from "react";
import articles from "./article-content";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

export default function ArticlePage() {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
  });

  useEffect(() => {
    setArticleInfo({ upvotes: Math.ceil(Math.random() * 10), comments: [] });
  });

  const { articleId } = useParams();
  const article = articles.find((article) => article.name === articleId);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <p>This article has {articleInfo.upvotes} upvote(s).</p>
      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </>
  );
}
