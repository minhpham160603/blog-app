import React from "react";
import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";
import userEvent from "@testing-library/user-event";

export default function AddCommentForm({ articleName, onArticleUpdated }) {
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");

  const { user, isLoading } = useUser();

  const addComment = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const res = await axios.post(
      `http://localhost:8000/api/articles/${articleName}/comments`,
      {
        text: commentText,
      },
      { headers }
    );
    const updatedArticle = res.data;
    onArticleUpdated(updatedArticle);
    setName("");
    setCommentText("");
  };
  return (
    <div id="add-comment-form">
      <h3>Add a Comment</h3>
      {user && <p>You are posting as {user.email}</p>}
      <label>
        Comment:
        <textarea
          rows="4"
          cols="50"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
      </label>
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}
