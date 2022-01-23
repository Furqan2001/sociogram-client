import React, { useState, useRef } from "react";
import { Card, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import DeleteButton from "./DeleteButton";
import moment from "moment";

function CommentsCard({ user, postId, comments }) {
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  return (
    <>
      <Card fluid>
        <Card.Content>
          <p>Post a comment</p>
          <Form>
            <div className="ui action input fluid">
              <input
                type="text"
                placeholder="Comment.."
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                ref={commentInputRef}
              />
              <button
                type="submit"
                className="ui button teal"
                disabled={comment.trim() === ""}
                onClick={submitComment}
              >
                Submit
              </button>
            </div>
          </Form>
        </Card.Content>
      </Card>
      {comments.map((comment) => (
        <Card fluid key={comment.id}>
          <Card.Content>
            {user && user.username === comment.username && (
              <DeleteButton postId={postId} commentId={comment.id} />
            )}
            <Card.Header>{comment.username}</Card.Header>
            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
            <Card.Description>{comment.body}</Card.Description>
          </Card.Content>
        </Card>
      ))}
    </>
  );
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation sumbitComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default CommentsCard;
