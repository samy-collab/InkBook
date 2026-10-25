import { useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceField, FormField } from '../components/FormField';
import { palette } from '../constants/palette';
import { loadIdeas, saveIdeas } from '../features/ideas/storage';
import {
  DIFFICULTY_OPTIONS,
  EMPTY_DRAFT,
  STATUS_OPTIONS,
  STYLE_OPTIONS,
  type IdeaDraft,
  type TattooDifficulty,
  type TattooIdea,
  type TattooStyle,
} from '../features/ideas/types';
import { validateIdeaDraft, type IdeaErrors } from '../features/ideas/validation';

export default function IdeaFormScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const isEditing = idParam !== undefined;
  const editId = typeof idParam === 'string' && idParam.length > 0 ? idParam : null;
  const [draft, setDraft] = useState<IdeaDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<IdeaErrors>({});
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(isEditing ? editId ? 'loading' : 'error' : 'ready');
  const [loadError, setLoadError] = useState(editId || !isEditing ? '' : 'Esta ideia não foi encontrada.');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!isEditing || !editId) return;
    let active = true;
    loadIdeas()
      .then((ideas) => {
        if (!active) return;
        const idea = ideas.find((item) => item.id === editId);
        if (!idea) {
          setLoadError('Esta ideia não foi encontrada.');
          setLoadState('error');
          return;
        }
        setDraft({
          title: idea.title,
          description: idea.description,
          style: idea.style,
          difficulty: idea.difficulty,
          status: idea.status,
        });
        setLoadState('ready');
      })
      .catch(() => {
        if (!active) return;
        setLoadError('Não foi possível carregar esta ideia. Tente novamente.');
        setLoadState('error');
      });
    return () => { active = false; };
  }, [editId, isEditing, retryKey]);

  function updateDraft<K extends keyof IdeaDraft>(field: K, value: IdeaDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError('');
  }

  function returnToList() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  async function save() {
    if (saving || loadState !== 'ready') return;
    const nextErrors = validateIdeaDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setSaveError('');
    try {
      const ideas = await loadIdeas();
      const values = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        style: draft.style as TattooStyle,
        difficulty: draft.difficulty as TattooDifficulty,
        status: draft.status,
      };
      let nextIdeas: TattooIdea[];
      if (isEditing) {
        const index = ideas.findIndex((item) => item.id === editId);
        if (index === -1) throw new Error('Esta ideia não foi encontrada. Volte à lista e tente novamente.');
        nextIdeas = ideas.map((item, itemIndex) => itemIndex === index ? { ...item, ...values } : item);
      } else {
        let id = Crypto.randomUUID();
        while (ideas.some((item) => item.id === id)) id = Crypto.randomUUID();
        nextIdeas = [{ id, ...values, createdAt: new Date().toISOString(), favorite: false }, ...ideas];
      }
      await saveIdeas(nextIdeas);
      returnToList();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Não foi possível salvar a ideia. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar para Minhas Ideias" onPress={returnToList} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text><Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <Text style={styles.topBrand}>INKBOOK  ✳</Text>
      </View>

      {loadState === 'loading' ? (
        <View style={styles.stateArea}><ActivityIndicator color={palette.accent} size="large" /><Text style={styles.stateText}>Carregando ideia...</Text></View>
      ) : loadState === 'error' ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Algo saiu do traço</Text>
          <Text style={styles.stateText}>{loadError}</Text>
          {editId && loadError.startsWith('Não foi possível') ? (
            <Pressable accessibilityRole="button" onPress={() => { setLoadState('loading'); setRetryKey((key) => key + 1); }} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.kicker}>{isEditing ? 'REFINAR O TRAÇO' : 'UMA NOVA PÁGINA'}</Text>
            <Text style={styles.heading}>{isEditing ? 'Editar ideia' : 'Nova ideia'}<Text style={styles.headingDot}>.</Text></Text>
            <Text style={styles.subtitle}>
              {isEditing ? 'Ajuste os detalhes e acompanhe o caminho do desenho.' : 'Anote o que você imagina. O desenho começa aqui.'}
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.sectionLabel}>01  /  A IDEIA</Text>
              <FormField
                error={errors.title}
                label="Título *"
                onChangeText={(value) => updateDraft('title', value)}
                placeholder="Ex.: Rosa com serpente"
                value={draft.title}
              />
              <FormField
                label="Descrição (opcional)"
                multiline
                onChangeText={(value) => updateDraft('description', value)}
                placeholder="Conte um pouco sobre o desenho..."
                value={draft.description}
              />

              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>02  /  OS DETALHES</Text>
              <ChoiceField
                error={errors.style}
                label="Estilo *"
                onChange={(value) => updateDraft('style', value)}
                options={STYLE_OPTIONS}
                value={draft.style}
              />
              <ChoiceField
                error={errors.difficulty}
                label="Dificuldade *"
                onChange={(value) => updateDraft('difficulty', value)}
                options={DIFFICULTY_OPTIONS}
                value={draft.difficulty}
              />

              <View style={styles.divider} />
              <Text style={styles.sectionLabel}>03  /  O ANDAMENTO</Text>
              <ChoiceField
                error={errors.status}
                label="Status *"
                onChange={(value) => updateDraft('status', value)}
                options={STATUS_OPTIONS}
                value={draft.status}
              />
            </View>

            {saveError ? <Text accessibilityLiveRegion="polite" style={styles.saveError}>{saveError}</Text> : null}
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={() => { void save(); }}
              style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, saving && styles.disabled]}
            >
              {saving ? <ActivityIndicator color={palette.card} /> : <Text style={styles.saveText}>{isEditing ? 'Salvar alterações' : 'Salvar ideia'}  ↗</Text>}
            </Pressable>
            <Text style={styles.footerNote}>Cada grande desenho começa com uma pequena ideia.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.paper },
  flex: { flex: 1 },
  topBar: { height: 56, marginHorizontal: 22, borderBottomWidth: 1, borderColor: palette.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12 },
  backArrow: { color: palette.ink, fontSize: 29, lineHeight: 29, marginRight: 3 },
  backText: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  topBrand: { color: palette.muted, fontSize: 10, letterSpacing: 1.5, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 30 },
  kicker: { color: palette.accent, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  heading: { color: palette.ink, fontFamily: 'serif', fontSize: 39, lineHeight: 49, marginTop: 10 },
  headingDot: { color: palette.accent },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 3, marginBottom: 24, maxWidth: 320 },
  formCard: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 22, padding: 19 },
  sectionLabel: { color: palette.accent, fontSize: 10, letterSpacing: 1.8, fontWeight: '800', marginBottom: 20 },
  divider: { borderTopWidth: 1, borderColor: palette.line, marginBottom: 23, marginTop: 1 },
  saveButton: { backgroundColor: palette.ink, borderRadius: 13, minHeight: 56, marginTop: 18, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: palette.card, fontSize: 14, fontWeight: '800' },
  saveError: { color: palette.error, backgroundColor: palette.errorSoft, borderRadius: 10, padding: 13, marginTop: 16, fontSize: 12, fontWeight: '600' },
  footerNote: { color: palette.muted, textAlign: 'center', fontFamily: 'serif', fontStyle: 'italic', fontSize: 12, marginTop: 24 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.55 },
  stateArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  stateText: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 9 },
  errorCard: { margin: 22, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 18, padding: 23 },
  errorTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 23 },
  retryButton: { backgroundColor: palette.ink, borderRadius: 10, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, marginTop: 18 },
  retryText: { color: palette.card, fontSize: 12, fontWeight: '800' },
});
