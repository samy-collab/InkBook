import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../constants/palette';
import type { TattooIdea } from '../features/ideas/types';

type Props = {
  idea: TattooIdea;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  disabled?: boolean;
};

const statusColors = {
  'Quero desenhar': { backgroundColor: palette.accentSoft, color: palette.accent },
  'Em andamento': { backgroundColor: palette.charcoalSoft, color: palette.ink },
  Concluído: { backgroundColor: palette.sageSoft, color: palette.sage },
} as const;

export function IdeaCard({ idea, onEdit, onDelete, onToggleFavorite, disabled = false }: Props) {
  const statusColor = statusColors[idea.status];

  return (
    <View style={styles.card}>
      <View style={styles.topLine}>
        <Text style={styles.eyebrow}>{idea.style.toUpperCase()}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={(idea.favorite ? 'Remover ' : 'Adicionar ') + idea.title + (idea.favorite ? ' dos favoritos' : ' aos favoritos')}
          accessibilityState={{ checked: idea.favorite, disabled }}
          disabled={disabled}
          hitSlop={8}
          onPress={onToggleFavorite}
          style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
        >
          <Text style={styles.favoriteMark}>{idea.favorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{idea.title}</Text>

      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>DIFICULDADE</Text>
          <Text style={styles.detailValue}>{idea.difficulty}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColor.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusColor.color }]}>{idea.status}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Editar ${idea.title}`}
          disabled={disabled}
          onPress={onEdit}
          style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
        >
          <Text style={styles.editText}>Editar ideia  ↗</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Excluir ${idea.title}`}
          disabled={disabled}
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { color: palette.accent, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  favoriteButton: { minWidth: 34, minHeight: 34, alignItems: 'center', justifyContent: 'center' },
  favoriteMark: { color: palette.accent, fontSize: 27, lineHeight: 32 },
  title: { color: palette.ink, fontFamily: 'serif', fontSize: 26, lineHeight: 32, marginTop: 10 },
  details: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  detail: { gap: 4 },
  detailLabel: { color: palette.muted, fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },
  detailValue: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  statusPill: { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8, maxWidth: '62%' },
  statusText: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  actions: { borderTopWidth: 1, borderColor: palette.line, marginTop: 19, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editButton: { paddingVertical: 4, paddingRight: 8 },
  editText: { color: palette.ink, fontSize: 13, fontWeight: '800' },
  deleteButton: { paddingVertical: 4, paddingLeft: 8 },
  deleteText: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  pressed: { opacity: 0.55 },
});
