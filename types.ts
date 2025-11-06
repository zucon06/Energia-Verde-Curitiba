import React from 'react';

export interface ProjectDocument {
  name: string;
  url: string; // a mock url to a PDF
  size: string; // e.g., "2.5 MB"
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  image: string;
  apy: number;
  fundingGoal: number;
  fundingRaised: number;
  term: string;
  type: 'Solar' | 'Eólica';
  description: string;
  investors: number;
  kwhGeneratedPerYear: number;
  co2AvoidedPerYear: number;
  documents: ProjectDocument[];
  updates: ProjectUpdate[];
}

export interface PortfolioInvestment {
  projectId: string;
  projectName: string;
  projectImage: string;
  tokensOwned: number;
  amountInvested: number;
  currentEarnings: number;
  status: 'Ativo' | 'Concluído';
}

export interface DAOProposal {
  id: string;
  title: string;
  summary: string;
  details: string;
  status: 'Ativa' | 'Aprovada' | 'Rejeitada';
  deadline: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
}

export interface PlatformStats {
  totalKWhGenerated: number;
  totalCO2Avoided: number; // in tons
  totalInvested: number;
  activeInvestors: number;
  averageESGScore: number;
}

export interface UserTransaction {
  id: string;
  date: string;
  project: string;
  type: 'Investimento' | 'Rendimento';
  amount: number;
  tokens: number;
  status: 'Concluído';
}

export interface UserPortfolio {
    totalInvested: number;
    totalEarnings: number;
    votingPower: number;
    personalCO2Impact: number; // in kg
    personalKWhGenerated: number; // in kWh
    socialImpactScore: number; // Points for investing in low-income community projects, etc.
    governanceActivityScore: number; // Points for active DAO participation.
    investments: PortfolioInvestment[];
    earningsHistory: { month: string; value: number }[];
    transactions: UserTransaction[];
}

export interface AchievementLevel {
    name: 'Bronze' | 'Prata' | 'Ouro' | 'Platina';
    threshold: number;
    description: string; 
    detailedDescription: string;
    nextStep: string;
}

export interface Achievement {
    id: string;
    title: string;
    // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    // FIX: Changed icon type to React.ReactElement<any> to resolve overload errors when using React.cloneElement.
    icon: React.ReactElement<any>;
    metric: keyof Pick<UserPortfolio, 'totalInvested' | 'personalCO2Impact' | 'governanceActivityScore'> | 'projectTypes';
    getMetricValue?: (portfolio: UserPortfolio) => number;
    unit: string;
    levels: AchievementLevel[];
}

export interface CommunityGoal {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  goalValue: number;
  unit: string;
  // FIX: Changed type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  // FIX: Changed icon type to React.ReactElement<any> to resolve overload errors when using React.cloneElement.
  icon: React.ReactElement<any>;
}