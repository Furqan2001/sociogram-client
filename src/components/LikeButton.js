import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { gql } from "@apollo/client";
import MyPopup from "../util/MyPopup";

function LikeButton({ user, post: { id, likes, likeCount } }) {
  const [liked, setLiked] = useState(false);
  const [likesNumber, setLikesNumber] = useState(likeCount);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikesNumber(likes.length);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" as={Link} to="/login" basic>
      <Icon name="heart" />
    </Button>
  );

  const onLikePost = () => {
    likePost();
    setLiked(!liked);
    setLikesNumber(!liked ? likesNumber + 1 : likesNumber - 1);
  };

  return (
    <Button as="div" labelPosition="right" onClick={onLikePost}>
      <MyPopup content={liked ? "Unlike" : "Like"}>{likeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {likesNumber}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
