import React from "react";
import { gql, useQuery } from "@apollo/client";


const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const {
    data: { getPost },
  } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
  }
  return <div>{postId}</div>;
};

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
    }
  }
`;

export default SinglePost;
