import React, { useEffect } from 'react'
import { Form, FormControl } from 'react-bootstrap'

export const Control = ({ name, storedData, label, required, register, placeholder, formState, setValue }: any) => {
  const { errors } = formState
  const error = (errors && errors[name])

  useEffect(() => {
    if (storedData && storedData[name]) setValue(name, storedData[name])
  }, [storedData, setValue, name])

  return (
    <React.Fragment >
      <Form.Group controlId={`form-${name}`}>
        <Form.Label>{label} {required && '*'}</Form.Label>
        <Form.Control
          type="text"
          placeholder={placeholder}
          {...register(name as any, { required })}

          isInvalid={error}
        /* isValid={dirty && !error} */
        />

        <FormControl.Feedback type="valid">
          Perfect!
        </FormControl.Feedback>
        <Form.Control.Feedback type="invalid">
          Please provide a valid {label}.
        </Form.Control.Feedback>
      </Form.Group>
    </React.Fragment>
  )
}

export default Control