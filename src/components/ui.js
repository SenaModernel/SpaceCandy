import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii, shadow } from '../theme';

export function BrandHeader({ title = 'SpaceCandy', subtitle, right }) {
  return (
    <View style={styles.brandHeader}>
      <View style={styles.brandMark}>
        <MaterialCommunityIcons name="rocket-launch-outline" size={24} color={colors.surface} />
      </View>
      <View style={styles.brandTextWrap}>
        <Text style={styles.brandTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.brandSubtitle}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function ScreenTitle({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.titleBlock}>
      {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.screenTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const buttonStyle = [
    styles.button,
    variant === 'secondary' && styles.buttonSecondary,
    variant === 'ghost' && styles.buttonGhost,
    variant === 'danger' && styles.buttonDanger,
    disabled && styles.buttonDisabled,
    style,
  ];
  const textStyle = [
    styles.buttonText,
    variant === 'secondary' && styles.buttonTextSecondary,
    variant === 'ghost' && styles.buttonTextGhost,
  ];
  const iconColor = variant === 'secondary' || variant === 'ghost' ? colors.ink : colors.surface;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [buttonStyle, pressed && !disabled && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {!!icon && <MaterialCommunityIcons name={icon} size={18} color={iconColor} />}
          <Text style={textStyle} numberOfLines={1} adjustsFontSizeToFit>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, color = colors.ink, background = colors.surface, count }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: background },
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      {count > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function InputField({
  label,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
  editable = true,
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputShell, multiline && styles.inputShellMultiline]}>
        {!!icon && <MaterialCommunityIcons name={icon} size={18} color={colors.muted} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
          placeholderTextColor="#98A2B3"
          style={[styles.input, multiline && styles.inputMultiline, !editable && styles.inputDisabled]}
        />
      </View>
    </View>
  );
}

export function Chip({ label, active, onPress, color = colors.violet }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Metric({ label, value, tone = 'violet' }) {
  const toneColor = {
    violet: colors.violet,
    berry: colors.berry,
    mint: colors.mint,
    sky: colors.sky,
    sun: colors.sun,
  }[tone];

  return (
    <View style={styles.metric}>
      <View style={[styles.metricDot, { backgroundColor: toneColor }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function EmptyState({ icon = 'tray-arrow-down', title, subtitle, action }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons name={icon} size={34} color={colors.violet} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
      {action}
    </View>
  );
}

export const cardStyle = styles.card;

const styles = StyleSheet.create({
  brandHeader: {
    backgroundColor: colors.midnight,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  brandTitle: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
  },
  brandSubtitle: {
    color: '#B8C1D2',
    fontSize: 13,
    marginTop: 2,
  },
  titleBlock: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  eyebrow: {
    color: colors.berry,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  screenTitle: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
  },
  screenSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  button: {
    minHeight: 46,
    borderRadius: radii.md,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  buttonTextSecondary: {
    color: colors.ink,
  },
  buttonTextGhost: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.78,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.berry,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countBadgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: '900',
  },
  inputWrap: {
    gap: 7,
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  inputShell: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  inputShellMultiline: {
    minHeight: 86,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 15,
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 58,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: colors.muted,
  },
  chip: {
    minHeight: 36,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  chipTextActive: {
    color: colors.surface,
  },
  metric: {
    flex: 1,
    minWidth: 96,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 5,
  },
  metricDot: {
    width: 22,
    height: 4,
    borderRadius: 2,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 22,
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: radii.md,
    backgroundColor: colors.softViolet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
});
