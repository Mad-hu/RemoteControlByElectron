import { remote } from "electron"
const win = remote.getCurrentWindow();
export const setWindowSize = (width: number, height: number) => {
  win.setSize(width, height);
}
export const setWindowCenter = () => {
  win.center();
}
export const setWindowResizeable = (resizable: boolean) => {
  win.resizable = resizable;
}
