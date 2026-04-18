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
    getFreelancerActiveContracts: [Contract]!
    clientDashboard: ClientDashboard!
    freelancerDashboard: FreelancerDashboard!
    earningsGraph: [Graph]!
    getRecentMessages(userId: String!): [UserChat!]!
  }

  type Mutation {
    completeOnboarding(bio: String!, skills: [String!], role: String!): User!
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
    editProfile(
      id: String!
      name: String
      bio: String
      skills: [String!]
    ): User!
    markWorkSubmitted(id: String!): Contract!
    completeContract(id: String!): Contract!
    processContractPayment(id: String!): Contract!
  }

  type Graph {
    month: String!
    total: Float!
  }

  type stateType {
    activeProposalsCount: Int!
    activeContractsCount: Int!
    totalProposalsCount: Int!
    totalEarnings: Float!
  }

  type FreelancerDashboard {
    stats: stateType
    latestProposals: [Proposal!]!
  }

  type ClientDashboard {
    activeProjects: [Project!]!
    activeContractsCount: Int!
    proposalsPendingCount: Int!
    totalspent: Float!
  }

  type UserChat {
    contractId: String
    projectName: String
    otherUser: User
    lastMessage: String
    lastMessageId: String
    lastMessageText: String
    lastMessageSender: String
    lastMessageCreatedAt: String
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
    REVIEW_PENDING
    REVISION_REQUESTED
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
    workSubmitted: Boolean
    stripePaymentIntentId: String
    paymentStatus: String
    amountPaid: Float
    platformFee: Float
    freelancerAmount: Float
    meeting: Meeting
  }

  type Meeting {
    id: String!
    contractId: String!
    streamMeetingId: String!
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
    stripeAccountId: String
    stripeOnboardingUrl: String
    onboardingComplete: Boolean
  }
`;
