import {gql, useMutation} from "@apollo/client";
import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../utils/hooks";
import {FETCH_POST_QUERY} from "../utils/graphql";

export default function PostForm() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION,{
    variables:values,
    update(proxy, result){
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY
      });
      proxy.writeQuery({query: FETCH_POST_QUERY, data:{
        getPosts:[result.data.createPost,...data.getPosts]
      }})
      values.body = '' 
    },
    onError(err){
      return err;
    }
  })
  
  function createPostCallback(){
    createPost();;
  }
  return (
    <>
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholer="Hi world!"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error?true:false}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
    {error && (
      <div className="ui error message" style={{marginBottom: 20}}>
        <ul className="list">
          <li>{error.graphQLErrors[0].message}</li>
        </ul>
      </div>  
    )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!){
    createPost(body: $body){
      id body createdAt username
      likes{
        id username createdAt
      }
      likeCount
      comments{
        id body username createdAt
      }
      commentCount
    }
  }
`;
