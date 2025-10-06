import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    clientAllPostedProjects(id: String!): [Project]!
    getProjectById(id: String!): Project!
    allClientsProject: [Project]!
    viewProposal(projectId: String!): [Proposal]
    allProposals: [Proposal]
    getClientActiveContracts: [Contract]!
    contractById(contractId: String!): Contract
    getUserChats: [UserChat!]!
  }

  type Mutation {
    completeOnboarding(bio: String!, skills: [String!]): User!
    createProject(
      title: String!
      description: String!
      budget: Float!
      deadline: String!
    ): Project!
    submitProposal(
      amount: Float!
      coverLetter: String!
      projectId: String!
    ): Proposal
    acceptProposal(proposalId: String!): Proposal!
    rejectProposal(proposalId: String!): Proposal!
    generateChatToken(contractId: String!): ChatToken!
  }

  type UserChat {
    contractId: String
    projectName: String
    otherUser: User
    lastMessage: String
  }

  type ChatToken {
    token: String!
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
    proposals: [Proposal!]!
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
    projectId: String
    freelancerId: String
    freelancer: User
    project: Project
  }

  enum ContractStatus {
    ACTIVE
    COMPLETED
    CANCELLED
  }

  type Contract {
    id: String
    freelancerId: String
    clientId: String
    project: Project
    client: User
    freelancer: User
    status: ContractStatus
    createdAt: String
  }

  enum Role {
    CLIENT
    FREELANCER
  }

  type User {
    id: String
    clerkId: String
    name: String
    email: String
    password: String
    role: Role
    avatar: String
    bio: String
    skills: [String!]!
    projects: [Project!]
    proposals: [Proposal!]
  }
`;
