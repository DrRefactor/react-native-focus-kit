import React from 'react';
import MainFocusController from '../../spatial/MainFocusController';
import FocusableLayer from '../../spatial/FocusableLayer';
import { range } from '../../utils';
import Focusable from '../../spatial/Focusable';

export const SimpleGrid: React.FC = () => {
  return (
    <MainFocusController>
      <FocusableLayer
        style={{width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', flexGrow: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}
      >
        {range(50).map(i => (
          <Focusable
            style={{borderWidth: 1, borderColor: 'cyan', borderRadius: 40, borderStyle: 'solid', width: '250px', height: '250px', margin: 25}}
            focusedStyle={{backgroundColor: 'cyan'}}
          >
            <div>Focusable {i}</div>
          </Focusable>
        ))}
      </FocusableLayer>
    </MainFocusController>
  )
}
