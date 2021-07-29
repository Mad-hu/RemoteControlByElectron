import { remote } from "electron"
const win = remote.getCurrentWindow();
export const setWindowSize = (width: number, height: number) => {
  win.setSize(Math.round(width), Math.round(height));
}
export const setWindowCenter = () => {
  win.center();
}
export const setWindowResizeable = (resizable: boolean) => {
  win.resizable = resizable;
}
export const resizeOriginalWindow = () => {
  win.setSize(1024, 576);
  win.resizable = true;
  win.center();
}
