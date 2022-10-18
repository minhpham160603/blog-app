import { useState, useEffect } from "react";
import React from "react";
import articles from "./article-content";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import axios from "axios";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ArticlePage() {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();
  const article = articles.find((article) => article.name === articleId);
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};

    // console.log(headers);
    const res = await axios.put(
      `http://localhost:8000/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updatedData = res.data;
    setArticleInfo(updatedData);
  };

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const res = await axios.get(
        `http://localhost:8000/api/articles/${articleId}`,
        {
          headers,
        }
      );
      const newArticleInfo = res.data;
      setArticleInfo(newArticleInfo);
    };
    if (isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>

      <div className="upvotes-section">
        {user ? (
          <button onClick={addUpvote}>
            {canUpvote ? "Upvote" : "Already upvoted"}
          </button>
        ) : (
          <button onClick={() => navigate("/login")}>Log in to Upvote</button>
        )}

        <p>This article has {articleInfo.upvotes} upvote(s).</p>
      </div>

      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}
        ></AddCommentForm>
      ) : (
        <button onClick={() => navigate("/login")}>Log in to comment</button>
      )}

      <CommentList comments={articleInfo.comments}></CommentList>
    </>
  );
}
