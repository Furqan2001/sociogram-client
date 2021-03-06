import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [modal, setModal] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deleteMutation] = useMutation(mutation, {
    update(cache) {
      setModal(false);
      if (!commentId) {
        const data = cache.readQuery({
          query: FETCH_POSTS_QUERY
        });
        const updatedPosts = data.getPosts.filter((p) => p.id !== postId);
        cache.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: updatedPosts
          }
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={`Delete ${commentId ? "comment" : "post"}`}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setModal(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={modal}
        onCancel={() => setModal(false)}
        onConfirm={deleteMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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

export default DeleteButton;
