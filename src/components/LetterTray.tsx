import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import CrateTile from './CrateTile';
import { TILE_GAP, TRAY_PAD, TRAY_W } from '../constants/config';
import type { Tile } from '../game/wordLogic';

type Props = {
  tiles: Tile[];
  picked: string[];
  onTapTile: (id: string) => void;
};

function LetterTrayBase({ tiles, picked, onTapTile }: Props) {
  return (
    <View style={styles.tray}>
      {tiles.map(tile => (
        <CrateTile
          key={tile.id}
          id={tile.id}
          letter={tile.letter}
          points={tile.points}
          tilt={tile.tilt}
          used={picked.includes(tile.id)}
          onPress={onTapTile}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    width: TRAY_W,
    alignSelf: 'center',
    paddingHorizontal: TRAY_PAD,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: TILE_GAP,
  },
});

export const LetterTray = memo(LetterTrayBase);
export default LetterTray;
