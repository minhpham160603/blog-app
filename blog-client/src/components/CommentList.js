import React from "react";

export default function CommentList({ comments }) {
  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment, i) => (
        <div
          className="comment"
          key={i + "" + comment.postedBy + ": " + comment.text}
        >
          <h4>{comment.postedBy}</h4>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
