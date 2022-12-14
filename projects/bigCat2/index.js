import './patch';
export { default as font } from './font';
export { default as billforms } from './config/billforms';
export { default as ProjectCfg } from './config/project.json';
export { default as LoginCfg } from './config/login.json';
export { default as RouteCfg } from './config/route.json';
export { default as controls } from './config/control';
export { default as util } from './util';
export { default as ModalCfg } from './config/modal.json';
export { default as FormPara } from './formpara';
import { ControlMappings } from 'yes-comp-react-native-web';
import ChainDict from './controls/ERPchainDict';

ControlMappings.defaultControlMapping.reg('dict', ChainDict);
