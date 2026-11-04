import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SLOT, SLOT_GAP, SLOT_ROW_GAP } from '../constants/config';

type Props = {
  length: number;
  filledWord: string | null;
};

function WordSlotRowBase({ length, filledWord }: Props) {
  const cells = [];
  for (let i = 0; i < length; i++) {
    const letter = filledWord ? filledWord[i] : '';
    cells.push(
      <View key={i} style={[styles.cell, filledWord ? styles.cellFilled : styles.cellEmpty]}>
        {letter ? <Text style={styles.letter}>{letter}</Text> : null}
      </View>,
    );
  }
  return <View style={styles.row}>{cells}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SLOT_GAP,
    marginBottom: SLOT_ROW_GAP,
  },
  cell: {
    width: SLOT,
    height: SLOT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellEmpty: {
    backgroundColor: 'rgba(27,108,168,0.06)',
    borderWidth: 1.5,
    borderColor: theme.colors.ocean.foam,
  },
  cellFilled: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1.5,
    borderColor: theme.colors.accent.primary,
  },
  letter: {
    fontSize: Math.max(13, Math.round(SLOT * 0.46)),
    fontWeight: '800',
    lineHeight: Math.max(16, Math.round(SLOT * 0.56)),
    color: theme.colors.text.primary,
  },
});

export const WordSlotRow = memo(WordSlotRowBase);
export default WordSlotRow;
