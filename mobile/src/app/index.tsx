import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IdeaCard } from '../components/IdeaCard';
import { palette } from '../constants/palette';
import { loadIdeas, saveIdeas } from '../features/ideas/storage';
import { STATUS_OPTIONS, type StatusFilter, type TattooIdea } from '../features/ideas/types';

const FILTERS: readonly StatusFilter[] = ['Todos', ...STATUS_OPTIONS];

export default function IdeasScreen() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<TattooIdea[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('Todos');
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoadState('loading');
    setActionError(null);
    loadIdeas()
      .then((loaded) => {
        if (!active) return;
        setIdeas(loaded);
        setLoadState('ready');
      })
      .catch(() => {
        if (active) setLoadState('error');
      });
    return () => { active = false; };
  }, [retryKey]));

  const visibleIdeas = filter === 'Todos' ? ideas : ideas.filter((idea) => idea.status === filter);

  async function deleteIdea(idea: TattooIdea) {
    if (deletingId || loadState !== 'ready') return;
    setDeletingId(idea.id);
    setActionError(null);
    const nextIdeas = ideas.filter((item) => item.id !== idea.id);
    try {
      await saveIdeas(nextIdeas);
      setIdeas(nextIdeas);
    } catch {
      setActionError('Não foi possível excluir a ideia. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  }

  function confirmDelete(idea: TattooIdea) {
    Alert.alert(
      'Excluir ideia?',
      `“${idea.title}” será removida definitivamente.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => { void deleteIdea(idea); } },
      ],
    );
  }

  function renderEmpty() {
    const hasIdeas = ideas.length > 0;
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyMark}>{hasIdeas ? '⌕' : '✦'}</Text>
        <Text style={styles.emptyTitle}>{hasIdeas ? 'Nenhuma ideia por aqui' : 'O papel ainda está em branco'}</Text>
        <Text style={styles.emptyText}>
          {hasIdeas
            ? 'Não há desenhos com esse status. Escolha outro filtro para continuar.'
            : 'Toda tatuagem começa com um traço. Registre a sua primeira ideia.'}
        </Text>
        {!hasIdeas ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/idea')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Cadastrar ideia</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.brandRow}>
        <View style={styles.brandSeal}><Text style={styles.brandSealText}>✳</Text></View>
        <Text style={styles.brand}>INKBOOK</Text>
        <Text style={styles.brandCaption}>DIÁRIO DE IDEIAS</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>SEU CADERNO CRIATIVO  ·  Nº 01</Text>
        <Text style={styles.heading}>Minhas ideias<Text style={styles.headingDot}>.</Text></Text>
        <Text style={styles.subtitle}>Um lugar para guardar os desenhos que ainda vão ganhar vida.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cadastrar nova ideia"
          disabled={loadState !== 'ready'}
          onPress={() => router.push('/idea')}
          style={({ pressed }) => [styles.createButton, pressed && styles.pressed, loadState !== 'ready' && styles.disabled]}
        >
          <Text style={styles.createPlus}>＋</Text><Text style={styles.createText}>Nova ideia</Text>
        </Pressable>
      </View>

      {loadState === 'error' ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Não foi possível abrir suas ideias.</Text>
          <Text style={styles.stateText}>Seus dados não foram alterados. Tente carregar novamente.</Text>
          <Pressable accessibilityRole="button" onPress={() => setRetryKey((key) => key + 1)} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : loadState === 'loading' ? (
        <View style={styles.loading}><ActivityIndicator color={palette.accent} size="large" /><Text style={styles.stateText}>Carregando ideias...</Text></View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coleção</Text>
            <Text style={styles.count}>{ideas.length} {ideas.length === 1 ? 'ideia' : 'ideias'}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={styles.filterScroll}>
            {FILTERS.map((option) => {
              const selected = filter === option;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrar: ${option}`}
                  accessibilityState={{ selected }}
                  key={option}
                  onPress={() => setFilter(option)}
                  style={[styles.filterChip, selected && styles.filterChipSelected]}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{option}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {actionError ? <Text accessibilityLiveRegion="polite" style={styles.actionError}>{actionError}</Text> : null}
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleIdeas}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            renderItem={({ item }) => (
              <IdeaCard
                disabled={deletingId !== null}
                idea={item}
                onDelete={() => confirmDelete(item)}
                onEdit={() => router.push({ pathname: '/idea', params: { id: item.id } })}
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.paper },
  brandRow: { height: 54, marginHorizontal: 22, borderBottomWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center' },
  brandSeal: { width: 27, height: 27, borderRadius: 14, backgroundColor: palette.ink, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  brandSealText: { color: palette.card, fontSize: 15 },
  brand: { color: palette.ink, fontSize: 15, fontWeight: '900', letterSpacing: 2.2 },
  brandCaption: { color: palette.muted, fontSize: 8, letterSpacing: 1.1, marginLeft: 'auto', fontWeight: '700' },
  hero: { paddingHorizontal: 22, paddingTop: 28, paddingBottom: 18 },
  kicker: { color: palette.accent, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  heading: { color: palette.ink, fontFamily: 'serif', fontSize: 39, lineHeight: 48, marginTop: 12 },
  headingDot: { color: palette.accent },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, maxWidth: 290, marginTop: 5 },
  createButton: { alignSelf: 'flex-start', backgroundColor: palette.ink, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 19, paddingVertical: 13, marginTop: 22 },
  createPlus: { color: palette.card, fontSize: 20, lineHeight: 20 },
  createText: { color: palette.card, fontSize: 13, fontWeight: '800' },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
  sectionHeader: { marginHorizontal: 22, marginTop: 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 23 },
  count: { color: palette.muted, fontSize: 11, fontWeight: '700' },
  filterScroll: { flexGrow: 0, marginTop: 14, marginBottom: 12 },
  filterRow: { paddingHorizontal: 22, gap: 8 },
  filterChip: { borderColor: palette.line, borderWidth: 1, borderRadius: 99, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: 10 },
  filterChipSelected: { backgroundColor: palette.accent, borderColor: palette.accent },
  filterText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  filterTextSelected: { color: palette.card },
  listContent: { paddingHorizontal: 22, paddingBottom: 34, flexGrow: 1 },
  emptyCard: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 22, marginTop: 4, padding: 26, alignItems: 'center' },
  emptyMark: { color: palette.accent, fontSize: 34, marginBottom: 8 },
  emptyTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 24, textAlign: 'center' },
  emptyText: { color: palette.muted, fontSize: 13, lineHeight: 20, marginTop: 9, textAlign: 'center' },
  emptyButton: { borderWidth: 1, borderColor: palette.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginTop: 18 },
  emptyButtonText: { color: palette.accent, fontWeight: '800', fontSize: 12 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateCard: { marginHorizontal: 22, marginTop: 14, padding: 22, borderWidth: 1, borderColor: palette.line, borderRadius: 18, backgroundColor: palette.card },
  stateTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 22 },
  stateText: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 8 },
  retryButton: { backgroundColor: palette.ink, borderRadius: 10, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, marginTop: 17 },
  retryText: { color: palette.card, fontSize: 12, fontWeight: '800' },
  actionError: { color: palette.error, backgroundColor: palette.errorSoft, marginHorizontal: 22, marginBottom: 10, padding: 12, borderRadius: 9, fontSize: 12, fontWeight: '600' },
});
