import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IdeaCard } from '../components/IdeaCard';
import { palette } from '../constants/palette';
import { loadIdeas, saveIdeas } from '../features/ideas/storage';
import { STATUS_OPTIONS, type IdeaFilter, type TattooIdea } from '../features/ideas/types';

const FILTERS: readonly IdeaFilter[] = ['Todos', ...STATUS_OPTIONS];

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export default function IdeasScreen() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<TattooIdea[]>([]);
  const [filter, setFilter] = useState<IdeaFilter>('Todos');
  const [search, setSearch] = useState('');
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [favoritingId, setFavoritingId] = useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<TattooIdea | null>(null);
  const mutationInProgress = useRef(false);

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
  }, []));

  async function retryLoad() {
    setLoadState('loading');
    try {
      setIdeas(await loadIdeas());
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }

  const searchTerm = normalizeSearch(search);
  const visibleIdeas = ideas.filter((idea) => {
    if (filter === 'Favoritas' && !idea.favorite) return false;
    if (filter !== 'Todos' && filter !== 'Favoritas' && idea.status !== filter) return false;
    if (!searchTerm) return true;
    return normalizeSearch(idea.title).includes(searchTerm) || normalizeSearch(idea.description).includes(searchTerm);
  });
  const showingResults = filter !== 'Todos' || searchTerm.length > 0;

  async function deleteIdea(idea: TattooIdea) {
    if (mutationInProgress.current || loadState !== 'ready') return;
    mutationInProgress.current = true;
    setDeletingId(idea.id);
    setActionError(null);
    const nextIdeas = ideas.filter((item) => item.id !== idea.id);
    try {
      await saveIdeas(nextIdeas);
      setIdeas(nextIdeas);
    } catch {
      setActionError('Não foi possível excluir a ideia. Tente novamente.');
    } finally {
      mutationInProgress.current = false;
      setDeletingId(null);
    }
  }

  async function toggleFavorite(idea: TattooIdea) {
    if (mutationInProgress.current || loadState !== 'ready') return;
    mutationInProgress.current = true;
    setFavoritingId(idea.id);
    setActionError(null);
    const nextIdeas = ideas.map((item) => item.id === idea.id ? { ...item, favorite: !item.favorite } : item);
    try {
      await saveIdeas(nextIdeas);
      setIdeas(nextIdeas);
    } catch {
      setActionError('Não foi possível atualizar os favoritos. Tente novamente.');
    } finally {
      mutationInProgress.current = false;
      setFavoritingId(null);
    }
  }

  function confirmDelete(idea: TattooIdea) {
    setPendingDeletion(idea);
  }

  function acceptDelete() {
    if (!pendingDeletion) return;
    const idea = pendingDeletion;
    setPendingDeletion(null);
    void deleteIdea(idea);
  }

  function renderEmpty() {
    const hasIdeas = ideas.length > 0;
    const hasSearch = searchTerm.length > 0;
    const searchScope = filter === 'Favoritas' ? ' entre as favoritas' : filter === 'Todos' ? '' : ' em ' + filter;
    const emptyTitle = hasSearch ? 'Nenhuma ideia encontrada' : !hasIdeas ? 'O papel ainda está em branco' : filter === 'Favoritas' ? 'Nenhuma favorita por aqui' : 'Nenhuma ideia por aqui';
    const emptyText = hasSearch
      ? `Não encontramos ideias para “${search.trim()}”${searchScope}. Tente outro termo ou limpe a busca.`
      : !hasIdeas
        ? 'Toda tatuagem começa com um traço. Registre a sua primeira ideia.'
        : filter === 'Favoritas'
          ? 'Toque na estrela de uma ideia para adicioná-la aos favoritos.'
          : 'Não há desenhos com esse status. Escolha outro filtro para continuar.';
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyMark}>{hasSearch || hasIdeas ? '⌕' : '✦'}</Text>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyText}>{emptyText}</Text>
        {hasSearch ? (
          <Pressable accessibilityRole="button" onPress={() => setSearch('')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Limpar busca</Text>
          </Pressable>
        ) : !hasIdeas ? (
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
          <Pressable accessibilityRole="button" onPress={() => { void retryLoad(); }} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : loadState === 'loading' ? (
        <View style={styles.loading}><ActivityIndicator color={palette.accent} size="large" /><Text style={styles.stateText}>Carregando ideias...</Text></View>
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coleção</Text>
            <Text style={styles.count}>
              {showingResults
                ? `${visibleIdeas.length} ${visibleIdeas.length === 1 ? 'resultado' : 'resultados'}`
                : `${ideas.length} ${ideas.length === 1 ? 'ideia' : 'ideias'}`}
            </Text>
          </View>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              accessibilityLabel="Buscar ideias por título ou descrição"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setSearch}
              placeholder="Buscar por título ou descrição..."
              placeholderTextColor="#938B81"
              returnKeyType="search"
              style={styles.searchInput}
              value={search}
            />
            {search.length > 0 ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setSearch('')} style={styles.clearSearch}>
                <Text style={styles.clearSearchText}>Limpar</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.filterBar}>
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mostrar apenas ideias favoritas"
              accessibilityState={{ selected: filter === 'Favoritas' }}
              onPress={() => setFilter(filter === 'Favoritas' ? 'Todos' : 'Favoritas')}
              style={[styles.filterChip, styles.favoriteFilter, filter === 'Favoritas' && styles.filterChipSelected]}
            >
              <Text style={[styles.favoriteFilterIcon, filter === 'Favoritas' && styles.filterTextSelected]}>★</Text>
              <Text style={[styles.filterText, filter === 'Favoritas' && styles.filterTextSelected]}>Favoritas</Text>
            </Pressable>
          </View>
          {actionError ? <Text accessibilityLiveRegion="polite" style={styles.actionError}>{actionError}</Text> : null}
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleIdeas}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            renderItem={({ item }) => (
              <IdeaCard
                disabled={deletingId !== null || favoritingId !== null}
                idea={item}
                onDelete={() => confirmDelete(item)}
                onEdit={() => router.push({ pathname: '/idea', params: { id: item.id } })}
                onToggleFavorite={() => { void toggleFavorite(item); }}
              />
            )}
          />
        </>
      )}
      <Modal
        animationType="fade"
        onRequestClose={() => setPendingDeletion(null)}
        transparent
        visible={pendingDeletion !== null}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalKicker}>CONFIRMAR EXCLUSÃO</Text>
            <Text style={styles.modalTitle}>Excluir ideia?</Text>
            <Text style={styles.modalText}>
              “{pendingDeletion?.title}” será removida definitivamente do seu caderno.
            </Text>
            <View style={styles.modalActions}>
              <Pressable accessibilityRole="button" onPress={() => setPendingDeletion(null)} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={acceptDelete} style={styles.confirmButton}>
                <Text style={styles.confirmText}>Excluir ideia</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  searchBox: { maxWidth: 520, marginHorizontal: 22, marginTop: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 13, minHeight: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  searchIcon: { color: palette.accent, fontSize: 22, marginRight: 8, lineHeight: 25 },
  searchInput: { flex: 1, color: palette.ink, fontSize: 13, paddingVertical: 12, minWidth: 0 },
  clearSearch: { paddingHorizontal: 4, paddingVertical: 8 },
  clearSearchText: { color: palette.accent, fontSize: 12, fontWeight: '800' },
  filterBar: { flexDirection: 'row', alignItems: 'center', maxWidth: 750, marginHorizontal: 22, marginTop: 14, marginBottom: 12, gap: 8 },
  filterScroll: { flex: 1, minWidth: 0 },
  filterRow: { gap: 8, paddingRight: 4 },
  filterChip: { borderColor: palette.line, borderWidth: 1, borderRadius: 99, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: 10 },
  filterChipSelected: { backgroundColor: palette.accent, borderColor: palette.accent },
  filterText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  filterTextSelected: { color: palette.card },
  favoriteFilter: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  favoriteFilterIcon: { color: palette.accent, fontSize: 13 },
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
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(36, 34, 31, 0.48)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: palette.card, borderRadius: 22, padding: 23, maxWidth: 420, width: '100%', alignSelf: 'center' },
  modalKicker: { color: palette.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.8 },
  modalTitle: { color: palette.ink, fontFamily: 'serif', fontSize: 28, marginTop: 12 },
  modalText: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 9 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 25 },
  cancelButton: { borderColor: palette.line, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  cancelText: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  confirmButton: { backgroundColor: palette.error, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  confirmText: { color: palette.card, fontSize: 12, fontWeight: '800' },
});
