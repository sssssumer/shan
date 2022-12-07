/*
 * @Author: gmf
 * @Date:   2016-05-13 09:12:40
 * @Last Modified by:   gmf
 * @Last Modified time: 2016-06-15 09:27:35
 */
// import App from './app/scm'
// import App from './cmcc'
import App from './src';
import { start } from 'yes-web';

import { ControlMappings, AuthenticatedRoute } from 'yes-comp-react-native-web';
import TextButton from './src/projects/bigCat2/controls/TextButton';

ControlMappings.defaultControlMapping.reg('textbutton', TextButton);
import 'antd-mobile/dist/antd-mobile.css';

export default () => {
    if (window.cordova) {
        document.addEventListener('deviceready', () => {
            start(App);
        }, false);
    } else {
        start(App);
    }
}
// export default () => start(App);
