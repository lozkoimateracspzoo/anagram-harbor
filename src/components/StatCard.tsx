import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export type StatItem = {
  key: string;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The ONE stat component for Menu and GameOver. No raster icons - colour and a
 * single accent dot carry the semantics, so every pill is geometrically equal
 * (rule #21). Never `flex: 1` here: the parent slot owns the flex (rule #19a).
 */
function StatCardBase({ value, label, valueColor }: Omit<StatItem, 'key'>) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Renders nothing unless at least two pills have something to show (rule #21). */
function StatRowBase({ items }: { items: StatItem[] }) {
  if (items.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {items.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCardBase value={item.value} label={item.label} valueColor={item.valueColor} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  slot: { flex: 1 },
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    backgroundColor: theme.colors.surface.card,
    shadowColor: '#0A3454',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  value: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: 0.4,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 13,
    color: theme.colors.text.secondary,
  },
});

export const StatCard = memo(StatCardBase);
export const StatRow = memo(StatRowBase);
export default StatCard;
