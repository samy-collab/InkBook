export const STYLE_OPTIONS = [
  'Tradicional',
  'Realismo',
  'Minimalista',
  'Blackwork',
  'Outro',
] as const;

export const DIFFICULTY_OPTIONS = ['Fácil', 'Média', 'Difícil'] as const;

export const STATUS_OPTIONS = [
  'Quero desenhar',
  'Em andamento',
  'Concluído',
] as const;

export type TattooStyle = (typeof STYLE_OPTIONS)[number];
export type TattooDifficulty = (typeof DIFFICULTY_OPTIONS)[number];
export type TattooStatus = (typeof STATUS_OPTIONS)[number];
export type StatusFilter = TattooStatus | 'Todos';

export type TattooIdea = {
  id: string;
  title: string;
  description: string;
  style: TattooStyle;
  difficulty: TattooDifficulty;
  status: TattooStatus;
  createdAt: string;
};

export type IdeaDraft = {
  title: string;
  description: string;
  style: TattooStyle | '';
  difficulty: TattooDifficulty | '';
  status: TattooStatus;
};

export const EMPTY_DRAFT: IdeaDraft = {
  title: '',
  description: '',
  style: '',
  difficulty: '',
  status: 'Quero desenhar',
};
