import classNames from "classnames";
import React, { useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import AgoraRTCService from "../../services/agora/agora-rtc.service";
import { MainCenterProps } from "../../services/home/home.service";
import { controlShowViewState, remoteCodeState } from "../../services/state-manage/home.state.service";

export const ShareBox = (props: MainCenterProps) => {
  const shareboardRef: React.RefObject<HTMLDivElement> =  React.createRef();
  const shareBoxRef: React.RefObject<HTMLDivElement> = React.createRef();
  const setControlShowView = useSetRecoilState(controlShowViewState);
  const [barVisible, setBarVisible] = useState(true);
  const cannleControl = () => {
    try {
      setControlShowView(false);
      props.agoraRTCService.unsubscribe(AgoraRTCService.remoteStream); // 停止订阅远端屏幕共享流
      const remoteCode = useRecoilValue(remoteCodeState);
      props.agoraRTMService.sendMessage(props.homeService.sendCloseShareScreen(remoteCode)); // 停止远端共享屏幕
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
