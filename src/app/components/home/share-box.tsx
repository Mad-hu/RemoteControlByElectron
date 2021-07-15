
import React from "react"
import AgoraRTCService from "../../services/agora/agora-rtc.service";
import AgoraRTMService from "../../services/agora/agora-rtm.service";

export class ShareBox extends React.Component {
  shareboardRef: React.RefObject<HTMLDivElement>;
  shareBoxRef: React.RefObject<HTMLDivElement>;
  constructor(
    props: any,
    private agoraRTCService: AgoraRTCService,
    private agoraRTMService: AgoraRTMService
  ) {
    super(props);
    this.shareBoxRef = React.createRef();
    this.shareboardRef = React.createRef();
  }
  cannleControl (){
    this.shareboardRef.current!.innerHTML = '';
    this.shareBoxRef.current!.style.zIndex = '-1';

    this.agoraRTCService.unsubscribe(AgoraRTCService.remoteStream); // 停止订阅远端屏幕共享流

    // this.closeLocalAudioStream(true); // 关闭本地音频
    // this.handleSendCloseShareScreen(); // 停止远端共享屏幕
  }

  render() {
    return (
      <div className="sharebox" ref={this.shareBoxRef}>
        <div className="board" ref={this.shareboardRef}/>
        <div className='cancle-control' onClick={this.cannleControl.bind(this)}>取消控制</div>
      </div>
    )
  }
}
