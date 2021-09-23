import classNames from "classnames";
import React, { useState } from "react"
import { useSetRecoilState } from "recoil";
import { rtcClient, shareTrack } from "../../services/agora/agora-rtc-ng.service";
import { resizeOriginalWindow } from "../../services/electron.service";
import { getRemoteCode, MainCenterProps, unListenMouseAndKeyEvent } from "../../services/home/home.service";
import { titleVisibleState } from "../../services/state-manage/base.state.service";
import { controlShowViewState, controlTextState } from "../../services/state-manage/home.state.service";

export const ShareBox = (props: MainCenterProps) => {
  const shareboardRef: React.RefObject<HTMLDivElement> =  React.createRef();
  const shareBoxRef: React.RefObject<HTMLDivElement> = React.createRef();
  const setControlShowView = useSetRecoilState(controlShowViewState);
  const [barVisible, setBarVisible] = useState(true);
  const setTitleVisible = useSetRecoilState(titleVisibleState);
  const setControlText = useSetRecoilState(controlTextState);
  const cannleControl = () => {
    try {
      setTitleVisible(true);
      setControlShowView(false);
      resizeOriginalWindow();
      rtcClient.unpublish(shareTrack); // 停止订阅远端屏幕共享流
      setControlText(`未连接`);
      unListenMouseAndKeyEvent();
      props.agoraRTMService.sendMessage(props.homeService.sendCloseShareScreen(getRemoteCode())); // 停止远端共享屏幕
    } catch (error) {
      console.log('cannleControl catch error:', error);
    }
  }

  const onCannleControlBtnToggle = () => {
    setBarVisible(!barVisible);
  }
  return (
    <div className="sharebox" id="sharebox" ref={shareBoxRef}>
      <div className="board"  id="board" ref={shareboardRef}/>
      <div className={classNames('cancle-control',
        {
          'cancle-bar-show': barVisible,
          'cancle-bar-hide': !barVisible,
        })}
        onMouseEnter={() => setBarVisible(true)}
        >
          <div onClick={cannleControl}>取消控制</div>
          <div>｜</div>
          <div onClick={onCannleControlBtnToggle}>↑</div>
        </div>
    </div>
  );
}
