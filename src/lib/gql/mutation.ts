import { gql } from "graphql-request";

export const COMPLETE_ONBOARD = gql`
  mutation CompleteOnboarding(
    $bio: String!
    $skills: [String!]!
    $role: String!
  ) {
    completeOnboarding(bio: $bio, skills: $skills, role: $role) {
      id
      name
      email
      role
      avatar
      bio
      skills
      clerkId
      onboardingComplete
      stripeOnboardingUrl
    }
  }
`;

export const CREATE_PROJ = gql`
  mutation Mutation(
    $title: String!
    $description: String!
    $budget: Float!
    $deadline: String!
  ) {
    createProject(
      title: $title
      description: $description
      budget: $budget
      deadline: $deadline
    ) {
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
export const CREATE_PROPOSAL = gql`
  mutation Mutation(
    $amount: Float!
    $coverLetter: String!
    $projectId: String!
  ) {
    submitProposal(
      amount: $amount
      coverLetter: $coverLetter
      projectId: $projectId
    ) {
      id
      coverLetter
      amount
      status
      projectId
      freelancerId
      project {
        id
        budget
        deadline
        description
        status
        title
      }
      freelancer {
        id
        name
        role
        bio
        skills
      }
    }
  }
`;

export const REJECT_PROPOSAL = gql`
  mutation RejectProposal($proposalId: String!) {
    rejectProposal(proposalId: $proposalId) {
      id
      coverLetter
      amount
      status
      projectId
      freelancerId
      freelancer {
        name
      }
      project {
        description
      }
    }
  }
`;

export const GENERATE_TOKEN = gql`
  mutation GenerateChatToken($contractId: String!) {
    generateChatToken(contractId: $contractId) {
      token
    }
  }
`;

export const MARK_PROJ_COMPLETED = gql`
  mutation Mutation($id: String!) {
    completeContract(id: $id) {
      status
      id
    }
  }
`;

export const MARK_PROJ_SUBMIT = gql`
  mutation MarkWorkSubmitted($id: String!) {
    markWorkSubmitted(id: $id) {
      id
      status
    }
  }
`;

export const PROCESS_PAYMENT = gql`
  mutation Mutation($id: String!) {
    processContractPayment(id: $id) {
      id
      freelancerId
      clientId
      status
      createdAt
      workSubmitted
      stripePaymentIntentId
      paymentStatus
      amountPaid
      platformFee
      freelancerAmount
      checkoutUrl
    }
  }
`;
