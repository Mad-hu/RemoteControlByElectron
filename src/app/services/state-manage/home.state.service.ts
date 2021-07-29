import { atom } from 'recoil'

export const connectionState = atom({
    key: 'connectionState',
    default: '未连接',
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

export const openState  = atom({
  key: 'openState',
  default: false,
});
export const openMsgState = atom({
  key: 'openMsgState',
  default: '正在初始化应用',
});
export const controlTextState  = atom({
  key: 'controlTextState',
  default: '未连接',
});

export const controlShowViewState  = atom({
  key: 'controlShowViewState',
  default: false,
});

export const shareScreenState  = atom({
  key: 'shareScreenState',
  default: false,
});
