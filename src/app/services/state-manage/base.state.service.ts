import { atom } from "recoil";

export const logoutState = atom({
  key: 'logoutState',
  default: false,
});

export const titleVisibleState = atom({
  key: 'titleVisibleState',
  default: true
})
