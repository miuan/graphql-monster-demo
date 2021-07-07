import * as React from 'react'
import { Button } from 'react-bootstrap'

export type TPostModel = {
  id: number
  text: string
}

export type TPostParams = {
  post: TPostModel
}

export const Post = ({ post }: TPostParams) => {
  return (
    <div>
      {post.id} {post.text} <Button variant={'danger'}>Remove</Button>
    </div>
  )
}
