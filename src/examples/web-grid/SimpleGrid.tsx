import React, { useRef } from 'react';
import MainFocusController from '../../spatial/MainFocusController';
import FocusableLayer from '../../spatial/FocusableLayer';
import { range, webArrowsEventEmitter } from '../../utils';
import Focusable from '../../spatial/Focusable';
import { View } from 'react-native';

export const SimpleGrid: React.FC = () => {
  const arrowEmitter = useRef(webArrowsEventEmitter()).current;
  return (
    <MainFocusController
      arrowKeyEventEmitter={arrowEmitter}
    >
      <FocusableLayer
        style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', flexGrow: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}
      >
        {range(50).map(i => (
          <Focusable
            style={{borderWidth: 1, borderColor: 'cyan', borderRadius: 40, borderStyle: 'solid', width: '250px', height: '250px', margin: 25}}
            focusedStyle={{backgroundColor: 'cyan'}}
          >
            <View>Focusable {i}</View>
          </Focusable>
        ))}
      </FocusableLayer>
    </MainFocusController>
  )
}
