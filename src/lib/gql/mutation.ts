import gql from "graphql-tag";

export const CREATE_USER = gql`
mutation Mutation($name: String!, $email: String!, $password: String!, $role: String!) {
  createUser(name: $name, email: $email, password: $password, role: $role)
}
`;

export const CREATE_PROJ = gql`
mutation Mutation($title: String!, $description: String!, $budget: Float!, $deadline: String!) {
  createProject(title: $title, description: $description, budget: $budget, deadline: $deadline) {
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
`