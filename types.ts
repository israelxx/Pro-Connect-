
export interface VideoScript {
  id: string;
  title: string;
  objective: string;
  hook: string;
  body: string;
  cta: string;
}

export interface ClientData {
  name: string;
  niche: string;
  instagram: string;
  tiktok?: string;
  website?: string;
  objectives: string[];
}

export enum AppState {
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  OUTPUT = 'OUTPUT'
}

export const OBJECTIVE_OPTIONS = [
  'Vendas',
  'Engajamento',
  'Autoridade',
  'Educação',
  'Viralização',
  'Conexão'
];
