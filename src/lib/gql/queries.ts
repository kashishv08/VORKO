import gql from "graphql-tag";

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
      contract {
        status
      }
      proposals {
        id
      }
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
        totalProjects
        hiringRate
      }
      proposals {
        id
        coverLetter
        amount
        status
        freelancer {
          id
          clerkId
          name
          avatar
          role
          skills
        }
      }
      contract {
        id
        status
        freelancer {
          name
        }
      }
    }
  }
`;

export const ALL_CLIENTS_PROJECTS = gql`
  query Query {
    allClientsProject {
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

export const PROJECT_PROPOSALS = gql`
  query ViewProposal($projectId: String!) {
    viewProposal(projectId: $projectId) {
      amount
      coverLetter
      status
      freelancer {
        name
        role
        skills
        bio
        id
        avatar
      }
      id
      project {
        title
        budget
        deadline
        description
        status
        id
        client {
          name
        }
      }
    }
  }
`;

export const ACCEPT_PROPOSAL = gql`
  mutation Mutation($proposalId: String!) {
    acceptProposal(proposalId: $proposalId) {
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

export const ALL_CONTRACTS = gql`
  query Query {
    getClientActiveContracts {
      id
      createdAt
      workSubmitted
      freelancer {
        id
        name
        email
        role
        avatar
        bio
        skills
      }
      status
      project {
        id
        title
        description
        budget
        deadline
        status
        createdAt
      }
    }
  }
`;

export const CONTRACT_BY_ID = gql`
  query ContractById($contractId: String!) {
    contractById(contractId: $contractId) {
      id
      clientId
      freelancerId
      createdAt
      workSubmitted
      workDescription
      deliverableUrl
      freelancerAmount
      platformFee
      amountPaid
      paymentStatus
      project {
        description
        title
        status
        budget
        deadline
        createdAt
        proposals {
          amount
          coverLetter
          status
        }
      }
      client {
        name
        id
      }
      freelancer {
        name
        avatar
        bio
        id
        role
        skills
      }
      status
    }
  }
`;

export const GET_ALL_CHATS = gql`
  query GetUserChats {
    getUserChats {
      contractId
      projectName
      lastMessage
      otherUser {
        name
        id
        avatar
        role
      }
    }
  }
`;

export const GET_FREELANCER_CONTRACT = gql`
  query GetFreelancerActiveContracts {
    getFreelancerActiveContracts {
      id
      clientId
      freelancerId
      workSubmitted
      project {
        title
        budget
        description
      }
      client {
        name
        avatar
      }
      freelancer {
        name
        avatar
      }
      createdAt
      status
    }
  }
`;

export const CLIENT_DASHBOARD = gql`
  query ClientDashboard {
    clientDashboard {
      activeProjectsCount
      activeContractsCount
      proposalsPendingCount
      activeProjects {
        id
        title
        description
        budget
        deadline
        status
        createdAt
        contract {
          status
        }
      }
      totalspent
      analytics {
        month
        total
      }
    }
  }
`;

export const FREELANCER_DASHBOARD = gql`
  query FreelancerDashboard {
    freelancerDashboard {
      latestProposals {
        id
        amount
        status
        project {
          id
          title
          client {
            name
          }
        }
      }
      recentContracts {
        id
        status
        createdAt
        amountPaid
        freelancerAmount
        project {
          id
          title
        }
      }
      stats {
        activeProposalsCount
        activeContractsCount
        totalCompletedContractsCount
        totalEarnings
      }
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile(
    $id: String!
    $skills: [String!]
    $name: String
    $bio: String
  ) {
    editProfile(id: $id, skills: $skills, name: $name, bio: $bio) {
      id
      name
      role
      avatar
      bio
      skills
    }
  }
`;

export const EARNING_GRAPH = gql`
  query EarningsGraph {
    earningsGraph {
      month
      total
    }
  }
`;

export const RECENT_CHAT = gql`
  query GetRecentMessages($userId: String!) {
    getRecentMessages(userId: $userId) {
      contractId
      projectName
      otherUser {
        id
        name
        avatar
      }
      lastMessageId
      lastMessageText
      lastMessageSender
      lastMessageCreatedAt
    }
  }
`;
