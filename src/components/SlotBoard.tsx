import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import WordSlotRow from './WordSlotRow';
import theme from '../constants/theme';
import { BOARD_BORDER, BOARD_PAD, BOARD_W } from '../constants/config';

type Props = {
  plan: number[];
  found: Record<number, string>;
};

/** Width comes from the frame-aware formula in config (rule #4). */
function SlotBoardBase({ plan, found }: Props) {
  return (
    <View style={styles.board}>
      {plan.map((length, i) => (
        <WordSlotRow key={`${length}-${i}`} length={length} filledWord={found[i] ?? null} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_W,
    alignSelf: 'center',
    padding: BOARD_PAD,
    paddingBottom: BOARD_PAD - 4,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(27,108,168,0.14)',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
});

export const SlotBoard = memo(SlotBoardBase);
export default SlotBoard;
