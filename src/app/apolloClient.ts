import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, fromPromise } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { refreshToken } from './refreshToken'
import { RetryLink } from '@apollo/client/link/retry'

const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    return true
  },
  delay: (count, operation, error) => {
    return count * 1000 * Math.random()
  },
})

let isRefreshing = false
let pendingRequests: any = []

const resolvePendingRequests = () => {
  //@ts-ignore
  pendingRequests.map((callback) => callback())
  pendingRequests = []
}

// https://able.bio/AnasT/apollo-graphql-async-access-token-refresh--470t1c8
const refreshTokenAction = (forward: any, operation: any) => {
  // error code is set to UNAUTHENTICATED
  // when AuthenticationError thrown in resolver
  let forward$

  if (!isRefreshing) {
    isRefreshing = true
    forward$ = fromPromise(
      refreshToken()
        // @ts-ignore
        .then(({ data }) => {
          const {
            data: { refreshToken_v1 },
          } = data
          localStorage.setItem('user.token', refreshToken_v1.token)
          localStorage.setItem('user.refreshToken', refreshToken_v1.refreshToken)

          // Store the new tokens for your auth link
          resolvePendingRequests()
          const oldHeaders = operation.getContext().headers
          // modify the operation context with a new token
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${refreshToken_v1.token}`,
            },
          })
          return forward(operation)
        })
        .catch((error) => {
          pendingRequests = []
          // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
          return
        })
        .finally(() => {
          isRefreshing = false
        }),
    ).filter((value) => Boolean(value))
  } else {
    // Will only emit once the Promise is resolved
    forward$ = fromPromise(
      new Promise((resolve) => {
        // @ts-ignore
        pendingRequests.push(() => resolve())
      }),
    )
  }

  // @ts-ignore
  return forward$.flatMap(() => {
    return forward(operation)
  })
}

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('user.token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_HOST,
})

// @ts-ignore
const erroLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors){
    if(graphQLErrors.some((error) => (error as any).tokenExpired)) {
      return refreshTokenAction(forward, operation)
    }
    graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`))
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([retryLink, erroLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'none',
    },
    query: {
      errorPolicy: 'none',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

export default apolloClient
