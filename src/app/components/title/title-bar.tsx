import { ipcRenderer } from "electron"
import React, { Fragment } from "react"
import { useSetRecoilState } from "recoil"
import { logoutState } from "../../services/state-manage/base.state.service"
import { LogoutView } from "../logout/logout"
interface TitleBarProps {
  agoraLeaveChannel: Function
}
export const TitleBar = (props: TitleBarProps) => {
  const setVisible = useSetRecoilState(logoutState);
  const onCloseAction = () => {
    setVisible(true);
  }
  return(
    <Fragment>
      <div className="title-bar">
        <div className="title-left">
          <div className="title-bar-logo">&#xe71d;</div>
          <span>RemoteControlByElectron</span>
        </div>
        <div className="title-bar-btns">
          <div className="title-bar-btn bar-min" onClick={() => ipcRenderer.send('min')}>&#xe60c;</div>
          <div className="title-bar-btn bar-max" onClick={() => ipcRenderer.send('max')}>&#xe64c;</div>
          <div className="title-bar-btn bar-close" onClick={onCloseAction}>&#xe695;</div>
        </div>
      </div>
      <LogoutView
        agoraLeaveChannel={props.agoraLeaveChannel}
      ></LogoutView>
    </Fragment>

  )
}
