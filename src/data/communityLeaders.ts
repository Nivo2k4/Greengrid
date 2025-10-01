import { User } from '../components/AuthProvider';

export interface CommunityLeader {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  avatar: string;
}

// In-memory storage for community leaders (in production, this would be a database)
let communityLeadersData: CommunityLeader[] = [
  {
    name: "Zaid Nasheem",
    email: "zaid.nasheem@greengrid.com",
    password: "123",
    role: "Admin",
    phone: "+94 77 123 4567",
    location: "Srilanka",
    bio: "System administrator and community leader focused on sustainable waste management and environmental initiatives.",
    joinDate: "2023-01-15",
    avatar: "ZA"
  },
  {
    name: "Mohamed Adnan",
    email: "mohamed.adnan@greengrid.com", 
    password: "leader456",
    role: "Sustainability Director",
    phone: "+94 77 123 4567",
    location: "Srilanka",
    bio: "Former city planner specializing in green infrastructure and circular economy solutions for urban communities.",
    joinDate: "2023-03-22",
    avatar: "MC"
  },
  {
    name: "Ovin Gunasekara",
    email: "ovin@greengrid.com",
    password: "leader789", 
    role: "Education Outreach Lead",
    phone: "+94 77 123 4567",
    location: "Srilanka",
    bio: "Passionate educator focused on environmental literacy and community engagement through innovative recycling programs.",
    joinDate: "2023-06-10",
    avatar: "ER"
  }
];

export const communityLeaders = communityLeadersData;

// Management functions
export const addCommunityLeader = (leader: CommunityLeader): void => {
  communityLeadersData.push(leader);
};

export const removeCommunityLeader = (email: string): void => {
  const index = communityLeadersData.findIndex(leader => leader.email === email);
  if (index > -1) {
    communityLeadersData.splice(index, 1);
  }
};

// Helper functions for authentication
export const isPredefindedLeader = (email: string): boolean => {
  return communityLeadersData.some(leader => leader.email === email);
};

export const validateLeaderCredentials = (email: string, password: string): boolean => {
  const leader = communityLeadersData.find(leader => leader.email === email);
  return leader ? leader.password === password : false;
};

export const getLeaderByEmail = (email: string): CommunityLeader | undefined => {
  return communityLeadersData.find(leader => leader.email === email);
};

