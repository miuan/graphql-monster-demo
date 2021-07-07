import { useMutation, useQuery } from '@apollo/client'
import { gql } from 'graphql.macro'
import React, { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'

import Loading from '../../../components/Loading/Loading'

import './Posts.css'

const CREATE_MUTATION = gql`
    mutation CreatePost($text: String!, $color: String) {
    createPost(text: $text, color: $color) {
        id
        text,
        color
    }
}`
const ALL_QUERY = gql`{
  allPost(orderBy: createdAt_desc){
      id,
      text,
      color
  }
}`

const Posts = () => {

  const [text, setText] = useState<string>('')
  const [color, setColor] = useState<string>('#28a745')

  const [createPost, { error: createError }] = useMutation(CREATE_MUTATION)
  const { data, loading, error: loadingError, refetch } = useQuery(ALL_QUERY)

  const onTextChange = (event: any) => {
    setText(event.target.value)
  }

  const onColorChange = (event: any) => {
    setColor(event.target.value)
  }

  const addPost = async () => {
    setText('')
    const variables = { text, color } as any
    await createPost({ variables })
    refetch()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="postsPage">

      {createError && <Alert variant={'danger'}>Add post: {createError.message}</Alert>}
      {loadingError && <Alert variant={'danger'}>Loading: {loadingError.message}</Alert>}
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>
          <table>
            <tr>
              <td>
                <div className="colorPicker">
                  <Form.Control
                    type="color"
                    id="exampleColorInput"
                    defaultValue={color}
                    title="Choose your color"
                    onChange={onColorChange}
                  />
                </div>

              </td>
              <td>
                Create Post V1 (without photos)
              </td>
            </tr>
          </table>
        </Form.Label>
        <Form.Control as="textarea" rows={5} value={text} onChange={onTextChange} />

      </Form.Group>

      <Button onClick={addPost} variant={'success'}>Post Now</Button>

      <hr />
      <h4>Posts</h4>
      {
        data?.allPost_v2?.map((post: any, idx: number) => (
          <div className="post" key={idx}>
            <div className="hightligtedText" style={{ backgroundColor: post.color }}>
              {post.text}
            </div>
          </div>
        ))
      }

      <a href={'https://github.com/miuan/fawesome/blob/37f894d8c62874f1c436e676f87d96e49b57d4e9/src/pages/user/Posts/Posts.tsx'} target={'_blank'} rel="noreferrer">Source code</a>

    </div >
  )
}




export default Posts
