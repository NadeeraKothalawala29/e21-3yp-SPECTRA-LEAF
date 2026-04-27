import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export default function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={theme.colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textMuted,
    fontSize: theme.font.small,
  },
});
