import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export interface IDeleteModalParams {
  show: boolean
  onHide: () => void
  onDelete: (deleteObject: any) => void
  modelName: string
  deleteObject?: any
  deleting?: boolean
}

export const DeleteModal: React.FC<IDeleteModalParams> = ({ show, onHide, onDelete, modelName, deleteObject, deleting }) => {
  const onDeleteAction = () => {
    if (!deleting) {
      onDelete(deleteObject)
    }
  }

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>
              Delete {'>>'} {deleteObject && deleteObject.name} {'<<'}
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          {!deleting ? (
            <p>
              Are you sure, you want delete {modelName} item with name <b>'{deleteObject && deleteObject.name}'</b> and id <i>'{deleteObject && deleteObject.id}'</i>
            </p>
          ) : (
            <p>
              Deleting {modelName} item with name '{deleteObject && deleteObject.name}' and id '{deleteObject && deleteObject.id}' ...
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button disabled={deleting} variant="danger" type="submit" onClick={onDeleteAction}>
            Delete
          </Button>
          <Button disabled={deleting} variant="primary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DeleteModal
