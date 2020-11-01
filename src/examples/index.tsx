import './web-grid/index.css';
import App from './web-grid/App';

import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
