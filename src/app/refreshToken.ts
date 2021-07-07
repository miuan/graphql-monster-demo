import axios from 'axios'

export const refreshToken = async () => {
    const userId = localStorage.getItem('user.id')
    const token = localStorage.getItem('user.token')
    const refreshToken = localStorage.getItem('user.refreshToken')
    return axios.post(process.env.REACT_APP_HOST || '', {
        query: `
            mutation refreshToken($userId: ID!, $token: String!, $refreshToken:String!){
                refreshToken_v1(userId: $userId, token: $token, refreshToken:$refreshToken){
                    token,
                    refreshToken
                }
            }
        `,
        variables: {
            userId,
            token,
            refreshToken
        }
    })
}