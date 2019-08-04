import {gql} from 'apollo-boost';

// RECIPE QUERIES
export const GET_ALL_RECIPES= gql`
    query {
        getAllRecipes {
            name
            description
            instructions
            category
            likes
            createdDate
        }
    }
`

// RECIPE MUTATIONS

// USER QUERIES

// USER MUTATIONS
export const SIGNUP_USER= gql`
    mutation($username: String!, $email: String!, $password: String!) {
        signupUser(username: $username, email: $email, password: $password) {
            token
        }
    }
`