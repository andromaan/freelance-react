export interface RoleVM {
  id: number;
  name: string;
}

export interface CountryVM {
  id: number;
  name: string;
  code?: string;
}

export interface UserLanguageVM {
  id: number;
  languageName: string;
  proficiencyLevel: number;
  proficiencyLevelName?: string;
}

export interface UserVM {
  id: string;
  email: string;
  roleId: number;
  role?: RoleVM;
  avatarImg?: string | null;
  country?: CountryVM | null;
  languages: UserLanguageVM[];
  displayName?: string | null;
  createdAt: string;
}
