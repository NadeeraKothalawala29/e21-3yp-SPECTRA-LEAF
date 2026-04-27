import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Variant = 'live' | 'ongoing' | 'completed' | 'priced' | 'neutral';

interface Props {
  label: string;
  variant?: Variant;
}

const palette: Record<Variant, { bg: string; fg: string }> = {
  live: { bg: '#fee2e2', fg: '#b91c1c' },
  ongoing: { bg: '#fef3c7', fg: '#92400e' },
  completed: { bg: '#dcfce7', fg: '#166534' },
  priced: { bg: '#dbeafe', fg: '#1e40af' },
  neutral: { bg: '#e5e7eb', fg: '#374151' },
};

export default function Badge({ label, variant = 'neutral' }: Props) {
  const c = palette[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {variant === 'live' && <View style={styles.dot} />}
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.font.tiny,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#dc2626',
    marginRight: 5,
  },
});
