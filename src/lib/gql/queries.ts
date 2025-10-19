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
      }
    }
  }
`;
