export interface FreelancerVM {
    id: string;
    bio: string;
    location: string;
    skills: SkillVM[];
    portfolio: PortfolioVM[];
    createdBy: string;
}

export interface SkillVM {
    id: number;
    name: string;
}

export interface PortfolioVM {
    id: string;
    title: string;
    description: string;
    portfolioUrl: string;
    createdAt: string;
}