import gql from "graphql-tag";

export const LOG_IN = gql`
  query Query($password: String!, $email: String!) {
    loginUser(password: $password, email: $email)
  }
`;

export const CLIENT_PROJ = gql`
  query ClientAllPostedProjects($id: String!) {
    clientAllPostedProjects(id: $id) {
      id
      title
      description
      budget
      deadline
      status
      createdAt
      client {
        id
        name
        email
        role
        avatar
        bio
        skills
      }
    }
  }
`;

export const GET_ONE_PROJECT = gql`
  query Query($id: String!) {
    getProjectById(id: $id) {
      id
      title
      description
      budget
      deadline
      status
      createdAt
      client {
        id
        name
        email
        password
        role
        avatar
        bio
        skills
      }
      proposals {
        id
        coverLetter
        amount
        status
      }
      contract {
        status
        freelancer {
          name
        }
      }
    }
  }
`;
