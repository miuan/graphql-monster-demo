import { useMutation, useQuery } from '@apollo/client'
import { loader } from 'graphql.macro'
import React, { useState } from 'react'
import { Alert, Button, Carousel, Form } from 'react-bootstrap'

import { uploadFile } from '../../../app/utils'
import DeleteModal, { IDeleteModalParams } from '../../../components/DeleteModal/DeleteModal'
import Loading from '../../../components/Loading/Loading'
import Image from '../../../components/Image/Image'

// import { Counter } from './features/counter/Counter';
import './Posts.css'
import { Post, TPostModel } from './Post'

const CREATE_MUTATION = loader('./graphql/create.gql')
const ALL_QUERY = loader('./graphql/all.gql')
const REMOVE_MUTATION = loader('./graphql/remove.gql')
const REMOVE_IMAGE_MUTATION = loader('./graphql/remove-image.gql')

const handeUpload = uploadFile('files')

const Posts = () => {

  const [text, setText] = useState<string>('')
  const [color, setColor] = useState<string>('#28a745')
  const [postForRemoveId, setPostForRemoveId] = useState<TPostModel['id']>()

  const [createPost, { error: createError }] = useMutation(CREATE_MUTATION)
  const { data, loading, error: loadingError, refetch } = useQuery(ALL_QUERY)
  const [removePost, { error: removeError }] = useMutation(REMOVE_MUTATION)
  const [removeImage, { error: removeImageError }] = useMutation(REMOVE_IMAGE_MUTATION)

  const [uploadError, setUploadError] = useState<any>()
  const [images, setImages] = useState<any>([])

  const addPost = async () => {
    setText('')


    const variables = { text, color } as any
    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(images.map((image: any) => handeUpload(image.file)))
      variables.imagesIds = uploadedImages.map((ui: any) => ui.id)
    }

    await createPost({ variables })
    setImages([])
    refetch()
  }

  const onTextChange = (event: any) => {
    setText(event.target.value)
  }

  const onColorChange = (event: any) => {
    setColor(event.target.value)
  }

  const showDeleteModal = (id: TPostModel['id']) => {
    setPostForRemoveId(id)
  }

  const onDelete: IDeleteModalParams['onDelete'] = async (id) => {
    const postForRemove = data?.allPost_v2.find((p: any) => p.id === id)
    await removePost({ variables: { id } })

    if (postForRemove?.images?.length > 0) {
      const removeAllImages = postForRemove?.images.map((image: any) => removeImage({ variables: { id: image.id } }))
      await Promise.all(removeAllImages)
    }
    setPostForRemoveId(undefined)
    refetch()
  }

  const onDeleteModalHide = () => {
    setPostForRemoveId(undefined)
  }

  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as any
    if (target?.files?.length > 0) {
      const added = Array.from(target?.files).map((file: any) => ({
        preview: URL.createObjectURL(file),
        file
      }))

      setImages([...images, ...added])
    }


  }

  const onImageRemove = (image: any) => {
    console.log(image)
    setImages(images.filter((i: any) => i.preview !== image.preview))
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="postsPage">

      {createError && <Alert variant={'danger'}>Add post: {createError.message}</Alert>}
      {removeError && <Alert variant={'danger'}>Remove post: {removeError.message}</Alert>}
      {loadingError && <Alert variant={'danger'}>Loading: {loadingError.message}</Alert>}
      {uploadError && <Alert variant={'danger'}>Upload: {uploadError.message}</Alert>}
      <Form.Group controlId="exampleForm.ControlSelect2">
        <Form.Label>
          <table>
            <tr>
              <td>

              </td>
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
                <label className="photoButton" htmlFor="uploadImage">
                  <div >Add photo</div>
                </label>
                <input type="file" id="uploadImage" onChange={onFileChange} style={{ display: 'none' }} multiple={true} />
              </td>
              <td>
                Post V2 with photos
              </td>
            </tr>
          </table>
        </Form.Label>
        <Form.Control as="textarea" rows={5} value={text} onChange={onTextChange} />
        {images && images.length > 0 && <div className="imagePreviews">
          <table >
            <tr>
              {images && images.map((image: any) => (<td>
                <div className="removePreview">
                  <PreviewImage src={image.preview} />
                  <span onClick={() => {
                    onImageRemove(image)
                  }} aria-hidden="true">x</span>
                </div>

              </td>))}
            </tr>
          </table>
        </div>}

      </Form.Group>

      <Button onClick={addPost} variant={'success'}>Post Now</Button>
      <div>


      </div>



      <hr />
      <h4>Posts</h4>
      {
        data?.allPost_v2?.map((post: any, idx: number) => (
          <div className="post" key={idx} >
            <h5>{post.user?.email}</h5>

            <Text text={post.text} color={post.color} hasImages={!!post.images?.length} />
            <CarouselImages images={post.images} />
            <div
              // size={'sm'}
              // variant={'danger'}
              onClick={() => {
                showDeleteModal(post.id)
              }}
              aria-hidden="true"
            >
              Remove
            </div>
          </div>
        ))
      }

      <a href={'https://github.com/miuan/fawesome/blob/37f894d8c62874f1c436e676f87d96e49b57d4e9/src/pages/user/Posts/Posts.tsx'} target={'_blank'}>Source code</a>

      <DeleteModal
        show={!!postForRemoveId}
        modelName={'Posts'}
        onDelete={onDelete}
        onHide={onDeleteModalHide}
        deleteObject={{ id: postForRemoveId }}
      />
    </div >
  )
}

export const Text = ({ text, color, hasImages }: { text: string, color?: string, hasImages?: boolean }) => {
  if (hasImages || text?.length > 100) {
    return (<p>{text}</p>)
  }

  return (<div className="hightligtedText" style={{ backgroundColor: color }}>
    {text}
  </div>)
}

const CarouselImages = ({ images }: { images: any[] }) => {
  return (<Carousel >
    {images.map((image) => (<Carousel.Item>
      <Image publicKey={image.publicKey} width={'800px'} height={'600px'} />
      <Carousel.Caption>
        <h3>First slide label</h3>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </Carousel.Caption>
    </Carousel.Item>))
    }

  </Carousel>)
}

export const PreviewImage = ({ src, width, height }: { src: string, width?: string | number, height?: string | number }) => {
  const _width = width || '100px'
  const _height = height || '100px'

  return (
    <div style={{
      overflow: 'hidden',
      width: _width,
      height: _height
    }}>
      <img
        alt=''
        style={{
          objectFit: 'cover',
          width: '100%',
          minHeight: '100%'
        }}
        src={src} />
    </div>
  )
}


export default Posts
