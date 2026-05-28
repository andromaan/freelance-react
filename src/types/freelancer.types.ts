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

export interface FreelancerFilterVM {
    page: number;
    pageSize: number;
    name?: string;
    email?: string;
    skillIds?: number[];
    minRating?: number;
    languageIds?: number[];
    countryIds?: number[];
}

export interface SearchFreelancerVM {
    id: string;
    userId: string;
    displayName: string | null;
    email: string | null;
    avatarImg: string | null;
    bio: string | null;
    location: string | null;
    skills: SkillVM[];
    languages: any[]; // UserLanguageVM[]
    country: any | null; // CountryVM | null
    rating: number;
    reviewsCount: number;
}