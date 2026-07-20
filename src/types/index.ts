export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  order?: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  createdAt?: number;
}

export interface AboutInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mission?: string;
  vision?: string;
  imageUrl?: string;
}

export type AdminSection = "overview" | "about" | "team" | "skills" | "projects";
