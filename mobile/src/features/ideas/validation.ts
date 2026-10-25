import {
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  STYLE_OPTIONS,
  type IdeaDraft,
} from './types';

export type IdeaErrors = Partial<Record<keyof IdeaDraft, string>>;

export function validateIdeaDraft(draft: IdeaDraft): IdeaErrors {
  const errors: IdeaErrors = {};

  if (draft.title.trim().length < 3) {
    errors.title = 'O título deve ter pelo menos 3 caracteres.';
  }
  if (!STYLE_OPTIONS.some((option) => option === draft.style)) {
    errors.style = 'Selecione um estilo.';
  }
  if (!DIFFICULTY_OPTIONS.some((option) => option === draft.difficulty)) {
    errors.difficulty = 'Selecione uma dificuldade.';
  }
  if (!STATUS_OPTIONS.some((option) => option === draft.status)) {
    errors.status = 'Selecione um status válido.';
  }

  return errors;
}
