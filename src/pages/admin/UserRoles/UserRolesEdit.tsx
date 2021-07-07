import { loader } from "graphql.macro";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import Control from "../../../components/Editor/Control";
import Editor from "../../../components/Editor/Editor";

const CREATE_MUTATION = loader('./graphql/mutation-create-user-role.gql')
const UPDATE_MUTATION = loader('./graphql//mutation-update-user-role.gql')
const QUERY = loader('./graphql/query-user-role.gql')

const UserRoleForm = ({ storedData, onSubmit, userRoleId, graphQlError }: any) => {
  const reactForm = useForm()
  const { handleSubmit } = reactForm
  return (<Form onSubmit={handleSubmit(onSubmit)}>
    <Control name={'name'} label={'Role name'} required={true} storedData={storedData} {...reactForm} />
    <Button type="submit">Save</Button>
  </Form>)
}

export const UserRoleEdit = (data: any) => {
  const { id } = useParams() as { id: string }

  return (
    <>
      <Editor
        id={id}
        name={'UserRole'}
        fields={['role']}
        query={{
          CREATE_MUTATION,
          UPDATE_MUTATION,
          QUERY
        }}
      >
        {(storedData: any, onSubmit: any, errors: any) => <UserRoleForm storedData={storedData} onSubmit={onSubmit} graphQlError={errors} userRoleId={id} />}
      </Editor>
    </>
  );
};

export default UserRoleEdit