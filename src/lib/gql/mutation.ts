import gql from "graphql-tag";

export const COMPLETE_ONBOARD = gql`
  mutation Mutation($bio: String!, $skills: [String!]) {
    completeOnboarding(bio: $bio, skills: $skills) {
      id
      name
      email
      role
      avatar
      bio
      skills
      clerkId
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
