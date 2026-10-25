import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  STYLE_OPTIONS,
  type TattooIdea,
} from './types';

const STORAGE_KEY = '@inkbook/ideas/v1';

function isTattooIdea(value: unknown): value is TattooIdea {
  if (typeof value !== 'object' || value === null) return false;
  const idea = value as Record<string, unknown>;
  return (
    typeof idea.id === 'string' &&
    idea.id.length > 0 &&
    typeof idea.title === 'string' &&
    idea.title.trim().length >= 3 &&
    typeof idea.description === 'string' &&
    STYLE_OPTIONS.some((option) => option === idea.style) &&
    DIFFICULTY_OPTIONS.some((option) => option === idea.difficulty) &&
    STATUS_OPTIONS.some((option) => option === idea.status) &&
    typeof idea.createdAt === 'string' &&
    !Number.isNaN(Date.parse(idea.createdAt))
  );
}

function isIdeaCatalog(value: unknown): value is TattooIdea[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  for (const idea of value) {
    if (!isTattooIdea(idea) || ids.has(idea.id)) return false;
    ids.add(idea.id);
  }
  return true;
}

export async function loadIdeas(): Promise<TattooIdea[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const data: unknown = JSON.parse(raw);
    if (!isIdeaCatalog(data)) throw new Error('Catálogo inválido');
    return data;
  } catch {
    throw new Error('Não foi possível carregar suas ideias. Tente novamente.');
  }
}

export async function saveIdeas(ideas: TattooIdea[]): Promise<void> {
  if (!isIdeaCatalog(ideas)) {
    throw new Error('Os dados da ideia são inválidos e não foram salvos.');
  }
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    throw new Error('Não foi possível salvar suas ideias. Tente novamente.');
  }
}
