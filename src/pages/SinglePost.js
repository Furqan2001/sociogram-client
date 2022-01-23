import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { gql, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Card, Image, Icon, Button, Label } from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import moment from "moment";
import CommentsCard from "../components/CommentsCard";
import MyPopup from "../util/MyPopup";

function SinglePost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useContext(AuthContext);

  const { data, loading } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId
    }
  });

  const deletePostCallback = () => {
    navigate("/");
  };

  let postMarkup;
  if (loading) {
    postMarkup = <p>Loading Post...</p>;
  } else {
    const {
      id,
      username,
      createdAt,
      body,
      likeCount,
      likes,
      commentCount,
      comments
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content={"Comment on post"}>
                  <Button as="div" labelPosition="right" onClick={() => {}}>
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <CommentsCard user={user} postId={id} comments={comments} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_SINGLE_POST = gql`
  query fetchSinglePost($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      createdAt
      body
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
