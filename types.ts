export interface ICPData {
  serviceName: string;
  companyProfile: {
    type: string; // e.g., Enterprise, SMB, Startup
    size: string; // Employees / Revenue
    geography: string;
    industry: string;
  };
  decisionMaker: {
    primary: string[];
    secondary: string[];
    role: string;
  };
  painPoints: string[];
  businessGoals: string[];
  buyingTriggers: string[];
  commercialReadiness: {
    budgetRange: string;
    buyingModel: string; // One-time / Retainer / Subscription / Hybrid
    approvalComplexity: 'Low' | 'Medium' | 'High';
  };
  technicalMaturity: {
    techStack: string[];
    teamStatus: 'None' | 'Limited' | 'Mature';
    dataReadiness: 'Low' | 'Medium' | 'High';
  };
  successCriteria: string[];
  objectionsAndRisks: {
    commonObjections: string[];
    riskFactors: string[];
  };
  whyUs: string;
  qualificationChecklist: {
    problemClarity: boolean;
    budgetClarity: boolean;
    decisionMakerAccess: boolean;
    timelineDefined: boolean;
    strategicFit: boolean;
  };
  engagementModel: string; // Discovery / MVP / Pilot / Full-scale / Long-term Partnership
  redFlags: string[];
  upsellPotential: string[];
  potentialClients: {
    name: string;
    website: string;
    description: string;
    contactEmail: string;
  }[];

  // Keep outreachTemplate as it is useful for the "Proposal" feature, even if not explicitly in the 15 points
  outreachTemplate: {
    subject: string;
    body: string;
  };
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}