import { ipcRenderer } from "electron"
import React from "react"

export const TitleBar = () => {
  return(
    <div className="title-bar">
      <div className="title-left">
        <div className="title-bar-logo">&#xe71d;</div>
        <span>RemoteControlByElectron</span>
      </div>
      <div className="title-bar-btns">
        <div className="title-bar-btn bar-min" onClick={() => ipcRenderer.send('min')}>&#xe60c;</div>
        <div className="title-bar-btn bar-max" onClick={() => ipcRenderer.send('max')}>&#xe64c;</div>
        <div className="title-bar-btn bar-close" onClick={() => ipcRenderer.send('close')}>&#xe695;</div>
      </div>
    </div>
  )
}
