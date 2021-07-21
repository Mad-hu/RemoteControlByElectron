
import { Stream } from "agora-rtc-sdk";
import { message } from "antd";
import { ipcRenderer } from "electron";
import React, { useEffect } from "react"
import { RecoilValue, SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import AgoraRTCService, { rtcMessageCategory } from "../../services/agora/agora-rtc.service";
import AgoraRTMService, { rtmTextMessageCategory } from "../../services/agora/agora-rtm.service";
import { HomeService, MainCenterProps } from "../../services/home/home.service";
import { controlShowViewState, controlTextState, loadingState, openMsgState, openState, remoteCodeState } from "../../services/state-manage/home.state.service"
const remoteShareCodeBaseNumbser = 10000000;
let rtcInit = false;
export const MainRight = (props: MainCenterProps) => {
  let rtmService!: AgoraRTMService;
  let rtcService!: AgoraRTCService;
  let homeService!: HomeService;
  let shareStream: Stream | undefined = undefined;
  let remoteShareCode: number = remoteShareCodeBaseNumbser;
  const setLoading = useSetRecoilState(loadingState);
  const setControlShowView = useSetRecoilState(controlShowViewState);
  const [remoteCode, setRemoteCode] = useRecoilState(remoteCodeState);
  const [open, setOpen] = useRecoilState(openState);
  const [openMsg, setOpenMsg] = useRecoilState(openMsgState);
  const [controlText, setControlText] = useRecoilState(controlTextState);
  useEffect(()=> {
    rtmService = props.agoraRTMService;
    rtcService = props.agoraRTCService;
    homeService = props.homeService;

    if(!rtcInit) {
      rtcInit = true;
      agoraRTCEvent(rtcService);
      agoraRTMEvent(rtmService);
    }
    setOpen(true);
    setOpenMsg('已连接');
  });

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoteCode(e.target.value);
  }
  const handleSubmit = async () => {
    if(remoteCode == '' || !remoteCode) {
      message.error('请输入远程电脑id');
      return;
    }
    const regex =/^[0-9]\d{5}$/;
    if(!regex.test(remoteCode)) {
      message.error('ID只能是6位数字');
      return;
    }
    remoteShareCode += parseInt(remoteCode);
    setLoading(true);
    try {
      await rtmService.sendMessage(JSON.stringify(homeService.sendStartShareScreen(remoteCode))); // 通知被控端，开始屏幕共享。
      setControlText('正在连接中...');
      setTimeout(() => {
        if(!shareStream) {
          setControlText('连接失败');
        }
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.log('sendMessage error:', error);
    }
  }
  const stopShareAction = () => {
    rtcService.unpublish(shareStream!);
    setControlText(`未连接`);
    shareStream = undefined
    remoteShareCode = remoteShareCodeBaseNumbser;
  }
  /**
   * 事件通知，均采用全体通知，不采用单体通知
   *
   * @param {AgoraRTMService} agoraRTMService
   */
  const agoraRTMEvent = (agoraRTMService: AgoraRTMService) => {
    /**
     * 鼠标点击事件信令接收，通知nodejs改变鼠标行为
     */
    agoraRTMService.on(rtmTextMessageCategory.MOUSE_CLICK, (jsonData) => {
      if (jsonData.userId == homeService.getLocalCode()) {
        jsonData.robot.screen.width = window.screen.width;
        jsonData.robot.screen.height = window.screen.height;
        ipcRenderer.send('robot', 'mouse', jsonData.robot);
      }
    });
    /**
     * 键盘按键事件信令接受，通知nodejs改变键盘行为
     */
    agoraRTMService.on(rtmTextMessageCategory.KEYBOARD_DOWN, (jsonData) => {
      if (jsonData.uid == homeService.getLocalCode()) {
        ipcRenderer.send('robot', 'key', jsonData.robot);
      }
    });
    /**
     * 被控端停止屏幕共享
     */
    agoraRTMService.on(rtmTextMessageCategory.STOP_SHARE_SCREEN, (jsonData) => {
      if(jsonData.userId == homeService.getLocalCode()) {
        stopShareAction();
      }
    });
    /**
     * 被控端开始屏幕共享
     */
    agoraRTMService.on(rtmTextMessageCategory.START_SHARE_SCREEN, (jsonData) => {
      if(jsonData.remoteUserId == homeService.getLocalCode()) {
        shareStream = rtcService.createStream({streamID: homeService.getShareCode(), audio: false, video: false, screen: true});
        rtcService.publish(shareStream);
        setControlText(`正在被${jsonData.userId}控制`);
      }
    });
    agoraRTMService.on(rtmTextMessageCategory.MOUSE_DOUBLE_CLICK, (jsonData) => {

    });
    agoraRTMService.on(rtmTextMessageCategory.MOUSE_MOVE, (jsonData) => {

    });

    agoraRTMService.on(rtmTextMessageCategory.ATTRIBUTES_UPDATED, (jsonData) => {

    });
    agoraRTMService.on(rtmTextMessageCategory.MEMBER_COUNT_UPDATE_CHANNEL, (jsonData) => {

    });
    agoraRTMService.on(rtmTextMessageCategory.JOIN_CHANNEL, (attributes) => {

    });
    agoraRTMService.on(rtmTextMessageCategory.LEAVE_CHANNEL, (jsonData) => {

    });
  }
  const agoraRTCEvent = (agoraRTCService: AgoraRTCService) => {
    /**
     * 当远端流加入后，根据屏幕共享流id规则，判断是否开始开始订阅
     */
    agoraRTCService.on(rtcMessageCategory.STREAM_ADD, (stream: Stream) => {
      console.log('STREAM_ADD:', stream);
      if(stream.getId() == remoteShareCode) {
        rtcService.subscribe(stream, {video: true, audio: false});
      }
    });
    /**
     * 订阅流成功后，收到的回调，处理流显示
     */
    agoraRTCService.on(rtcMessageCategory.STREAM_SUBSCRIBED, (stream: Stream) => {
      console.log('STREAM_SUBSCRIBED:', stream);
      if(stream.getId() == remoteShareCode) {
        setControlShowView(true);
        setLoading(false);
        stream.play('board', { fit: 'contain' });
        homeService.listenMouseAndKeyEvent(remoteCode, rtmService);
      }
    });
    agoraRTCService.on(rtcMessageCategory.STREAM_PUBLISHED, (evt: any) => {
      console.log('stream published and send shared message');
    });
    agoraRTCService.on(rtcMessageCategory.STREAM_REMOVED, (stream: Stream) => {
      console.log('STREAM_REMOVED:', stream);
    });
    agoraRTCService.on(rtcMessageCategory.PEER_LEAVE, (attr: { uid: string; reason: string; }) => {
      console.log('PEER_LEAVE:', attr);
    });

  }
  return (
    <section className="content">
      <h1>您的ID:{props.homeService.getLocalCode()}</h1>
      <input type='text' className='input-t' onChange={inputChange} placeholder='请输入连接ID:' maxLength={6}></input>
      <button className="btn" title='连接' onClick={handleSubmit}>连接</button>
      <div className="msg">
        <div className='msg-server'>
          <div className={open ? 'open-success': 'open-error'}></div>
          {openMsg}
        </div>
        <div>{controlText}</div>
      </div>
    </section>
  )
}
