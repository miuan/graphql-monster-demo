import React from "react";
import gql from 'graphql-tag';
import FilteredList from "../../../components/List/FilteredList";
import ConnectBase from "../../../components/List/ConnectBase";
import { loader } from "graphql.macro";

const QUERY_ALL_USERS_ADMIN = loader('./graphql/query-all-user-admin.gql')
const USER_ROLE_QUERY = loader('./graphql/query-all-user-role.gql')
const MUTATION_ADD_USER_ROLE_TO_USER = loader('./graphql/mutation-add-user-role-to-user.gql')
const MUTATION_REMOVE_USER_ROLE_FROM_USER = loader('./graphql/mutation-remove-user-role-from-user.gql')
const MUTATION_REMOVE_USER = loader('./graphql/mutation-remove-user.gql')
const USER_LIST_QUERY = gql`
{allUser{id}}`;

const ConnectRole: React.FC<{ value: any, names?: any, item: any }> = ({ value, names, item }) => {

  const gql = {
    QUERY: USER_ROLE_QUERY,
    ADD: MUTATION_ADD_USER_ROLE_TO_USER,
    REMOVE: MUTATION_REMOVE_USER_ROLE_FROM_USER
  }

  return <ConnectBase value={value} names={names} gql={gql} item={item} />
}

export const UsersList: React.FC<{ userId?: string, adminMode?: boolean }> = ({ userId, adminMode = false }) => {
  return (
    <div>
      <FilteredList
        name={'Users'}
        fields={['email', 'password', { name: 'roles.name', component: ConnectRole }, 'roles.id']}
        userId={userId}
        adminMode={adminMode}
        queries={{ USER_LIST_QUERY, ADMIN_LIST_QUERY: QUERY_ALL_USERS_ADMIN, DELETE_MUTATION: MUTATION_REMOVE_USER }} />
    </div>
  )
}

export default UsersList