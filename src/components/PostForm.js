import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [body, setBody] = useState("");

  const [createNewPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: {
      body
    },
    update(cache, { data: { createPost: createdPost } }) {
      const data = cache.readQuery({
        query: FETCH_POSTS_QUERY
      });
      const updatedData = [createdPost, ...data.getPosts];
      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: updatedData
        }
      });
    }
  });

  const onSubmit = () => {
    createNewPost();
    setBody("");
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Whats on your mind!!"
            name="body"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
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
        body
        createdAt
      }
    }
  }
`;

export default PostForm;
