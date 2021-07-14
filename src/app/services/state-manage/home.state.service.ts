import { atom } from 'recoil'

export const connectionState = atom({
    key: 'connectionState',
    default: '未连接',
});
