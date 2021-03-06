import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { message } from "antd";
import { ipcRenderer } from "electron";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { getScreenTrack, rtcClient, setShareTrack, shareTrack } from "../../services/agora/agora-rtc-ng.service";
import AgoraRTMService, { rtmTextMessageCategory } from "../../services/agora/agora-rtm.service";
import { resizeOriginalWindow, setWindowCenter, setWindowResizeable, setWindowSize } from "../../services/electron.service";
import { HomeService, MainCenterProps, setRemoteCode, unListenMouseAndKeyEvent } from "../../services/home/home.service";
import { titleVisibleState } from "../../services/state-manage/base.state.service";
import { controlShowViewState, controlTextState, loadingState, openMsgState, openState } from "../../services/state-manage/home.state.service"

let remoteCode = '';
let rtcInit = false;
export const MainRight = (props: MainCenterProps) => {
  let shareScreenState = false;
  let rtmService!: AgoraRTMService;
  let homeService!: HomeService;
  const setTitleVisible = useSetRecoilState(titleVisibleState);
  const setLoading = useSetRecoilState(loadingState);
  const setControlShowView = useSetRecoilState(controlShowViewState);
  const [open, setOpen] = useRecoilState(openState);
  const [openMsg, setOpenMsg] = useRecoilState(openMsgState);
  const [controlText, setControlText] = useRecoilState(controlTextState);
  useEffect(()=> {
    rtmService = props.agoraRTMService;
    homeService = props.homeService;

    if(!rtcInit) {
      rtcInit = true;
      agoraRTCEvent();
      agoraRTMEvent(rtmService);
    }
    setOpen(true);
    setOpenMsg('已连接');
  });

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    remoteCode = e.target.value;
    setRemoteCode(remoteCode);
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
    if(remoteCode == homeService.getLocalCode().toString()) {
      message.error('不能连接本机');
      return;
    }
    setLoading(true);
    try {
      await rtmService.sendMessage(homeService.sendStartShareScreen(remoteCode)); // 通知被控端，开始屏幕共享。
      setControlText('正在连接中...');
      setTimeout(() => {
        if(!shareTrack) {
          setControlText('连接失败');
        }
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.log('sendMessage error:', error);
    }
  }
  const stopShareAction = () => {
    rtcClient.unpublish(shareTrack!);
    setControlText(`未连接`);
    setShareTrack(undefined);
    shareScreenState = false;
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
    agoraRTMService.on(rtmTextMessageCategory.START_SHARE_SCREEN,async (jsonData) => {
      // 正在被控制，不能再被其他人控制。
      if(shareScreenState) {
        return;
      }
      try {
        if(jsonData.remoteUserId == homeService.getLocalCode()) {
          const {shareTrack, size} = await getScreenTrack();
          setShareTrack(shareTrack);
          await rtcClient.publish(shareTrack!);
          setControlText(`正在被${jsonData.userId}控制`);
          shareScreenState = true;
          homeService.sendReadyShareScreen(jsonData.userId, size);
        }
      } catch (error) {

      }
    });
    /**
     * 被控端已经开始屏幕共享
     */
     agoraRTMService.on(rtmTextMessageCategory.READY_SHARE_SCREEN, (jsonData) => {
      if(jsonData.userId == homeService.getLocalCode()) {
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
  const agoraRTCEvent = () => {
    rtcClient.on('user-joined', (user: IAgoraRTCRemoteUser) => {

    });
    /**
     * 当远端流加入后，根据屏幕共享流id规则，判断是否开始开始订阅并渲染视频
     */
    rtcClient.on('user-published', async (remoteUser, mediaType) => {
      console.log('user-published:', remoteUser);
      console.log('remoteCode:', remoteCode);
      console.log('remoteUserID:', remoteUser.uid);
      try {
        if(remoteUser.uid == remoteCode) {
          await rtcClient.subscribe(remoteUser, 'video');
          setControlShowView(true);
          setLoading(false);
          console.log('subscribe video success');
          if(remoteUser.hasVideo) {
            remoteUser.videoTrack!.play('board', { fit: 'contain' });
            setTimeout(() => {
              console.log(remoteUser.videoTrack?.getCurrentFrameData());
            }, 500);
            homeService.listenMouseAndKeyEvent(remoteCode, rtmService);
            setTitleVisible(false);

          }
        }
      } catch (error) {
        console.log('user-published error:', error);
      }
    });
    // 当远端停止发布，检查流id与本地连接的远程id是否一致。 一致就停止
    rtcClient.on('user-unpublished', async (remoteUser, mediaType) => {
      console.log('user-unpublished:', remoteUser);
      if(remoteUser.uid == remoteCode && remoteUser.videoTrack) {
        remoteUser.videoTrack.stop(); // 停止播放
        await rtcClient.unsubscribe(remoteUser, 'video'); // 取消订阅
        setControlShowView(false); // 关闭远程控制页面
        unListenMouseAndKeyEvent();
        setControlText('远端已断开连接');
        setTitleVisible(true);
        resizeOriginalWindow();
        console.log('unsubscribe video success');
      }
    })
  }
  const setWindowBounds = (width: number, height: number) => {
    const shareScreenHeight = width;
    const shareScreenWidth = height;
    let shareControlWindowWidth = shareScreenWidth * window.screen.availHeight / shareScreenHeight;
    let shareControlWindowHeight = window.screen.availHeight;
    if(shareScreenWidth < shareScreenHeight) {
      shareControlWindowHeight = shareScreenHeight * window.screen.availWidth / shareScreenWidth;
      shareControlWindowWidth = window.screen.availWidth;
    }
    setWindowSize(shareControlWindowWidth, shareControlWindowHeight);
    setWindowCenter();
    setWindowResizeable(false);
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
