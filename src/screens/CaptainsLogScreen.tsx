import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import ScreenHeader, { NavButton } from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import assets from '../assets';
import theme from '../constants/theme';

export type LogEntry = {
  word: string;
  note: string;
};

type Props = {
  entries: LogEntry[];
  onBack: () => void;
};

function LogRow({ word, note }: LogEntry) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.note} numberOfLines={1}>
          {note}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{String(word.length)}</Text>
      </View>
    </View>
  );
}

export function CaptainsLogScreen({ entries, onBack }: Props) {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LogEntry>) => <LogRow word={item.word} note={item.note} />,
    [],
  );
  const keyExtractor = useCallback((item: LogEntry) => item.word, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScreenBackground variant="menu">
        <ScreenHeader
          title="CAPTAINS LOG"
          leftSlot={<NavButton icon={assets.iconHome} onPress={onBack} label="Harbor front" />}
        />

        <View style={styles.body}>
          {entries.length > 0 ? (
            <FlatList
              data={entries}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.empty}>
              <Image source={assets.crateStack} style={styles.emptyArt} />
              <Text style={styles.emptyText}>NO WORDS LOGGED YET</Text>
              <Text style={styles.emptyHint}>
                Unscramble a crate word and it lands here.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <SecondaryButton label="HARBOR FRONT" onPress={onBack} />
        </View>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  listContent: { paddingBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    shadowColor: '#0A3454',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  rowText: { flex: 1, paddingRight: 10 },
  word: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: 21,
    color: theme.colors.text.primary,
  },
  note: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  badge: {
    minWidth: 34,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27,108,168,0.08)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
    color: theme.colors.accent.primary,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyArt: { width: 110, height: 110, resizeMode: 'contain', opacity: 0.9 },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.4,
    lineHeight: 18,
    color: theme.colors.text.muted,
  },
  emptyHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: theme.colors.text.muted,
  },
  footer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
});

export default CaptainsLogScreen;
