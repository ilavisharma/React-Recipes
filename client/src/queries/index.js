import { gql } from 'apollo-boost';

// RECIPE QUERIES
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name      
      category      
    }
  }
`;

// RECIPE MUTATIONS

// USER QUERIES
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
    }
  }
`;

// USER MUTATIONS
export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;
