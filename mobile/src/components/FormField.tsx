import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '../constants/palette';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
};

export function FormField({ label, value, onChangeText, placeholder, error, multiline = false }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="sentences"
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A49C91"
        selectionColor={palette.accent}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

type ChoiceFieldProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
};

export function ChoiceField<T extends string>({ label, options, value, onChange, error }: ChoiceFieldProps<T>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${label}: ${option}`}
              accessibilityState={{ selected }}
              key={option}
              onPress={() => onChange(option)}
              style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 23 },
  label: { color: palette.ink, fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 10 },
  input: { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, borderRadius: 14, color: palette.ink, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, minHeight: 52 },
  multiline: { height: 108 },
  inputError: { borderColor: palette.error },
  error: { color: palette.error, marginTop: 7, fontSize: 12, fontWeight: '600' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  option: { backgroundColor: palette.card, borderColor: palette.line, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 11 },
  optionSelected: { backgroundColor: palette.ink, borderColor: palette.ink },
  optionText: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  optionTextSelected: { color: palette.card },
  pressed: { opacity: 0.65 },
});
