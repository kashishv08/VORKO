import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    loginUser(password: String!, email: String!): Boolean!
    clientAllPostedProjects(id: String!): [Project]!
    getProjectById(id: String!): Project!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      role: String!
    ): Boolean!
    createProject(
      title: String!
      description: String!
      budget: Float!
      deadline: String!
    ): Project!
  }

  enum ProjectStatus {
    OPEN
    HIRED
    CLOSED
  }

  type Project {
    id: String
    title: String
    description: String
    budget: Float
    deadline: String
    status: ProjectStatus
    createdAt: String
    client: User
    proposals: [Proposal]
    contract: Contract
  }

  enum ProposalStatus {
    SUBMITTED
    ACCEPTED
    REJECTED
  }

  type Proposal {
    id: String
    coverLetter: String
    amount: Float
    status: ProposalStatus
  }

  enum ContractStatus {
    ACTIVE
    COMPLETED
    CANCELLED
  }

  type Contract {
    project: Project
    client: User
    freelancer: User
    status: ContractStatus
  }

  type User {
    id: String
    name: String
    email: String
    password: String
    role: String
    avatar: String
    bio: String
    skills: [String]
  }
`;
