import AgoraRTMService, { rtmTextMessageCategory } from "../../services/agora/agora-rtm.service";
/* 本机编码 */
const localCode = (Math.floor(Math.random() * 1000000) + new Date().getTime()).toString().substring(7);
/* 公共房间名称 */
const channelName = 'testroom';
let remoteCode = '';

export const setRemoteCode = (code: string) => {
  remoteCode = code;
}
export const getRemoteCode = () => {
  return remoteCode;
}

export const unListenMouseAndKeyEvent = () => {
  window.onkeydown = null;
  window.onmouseup = null;
}
export interface MainCenterProps {
  localCode: string;
  agoraRTMService: AgoraRTMService;
  homeService: HomeService;
}

export class HomeService {
  getChannel() {
    return channelName;
  }
  getLocalCode() {
    return localCode;
  }

  /**
   * 停止远端共享屏幕
   *
   * @memberof ShareBox
   */
  sendCloseShareScreen(userId: string | number) {
    return {
      command: rtmTextMessageCategory.STOP_SHARE_SCREEN,
      userId: userId
    }
  }

  /**
   * 告诉远端，已经准备好了屏幕共享，你可以拉流了，并且把屏幕共享的参数附带
   *
   * @param {(string | number)} userId 控制端用户id
   * @param {{width: number, height: number}} size 被控端屏幕宽高。
   * @return {*}
   * @memberof HomeService
   */
  sendReadyShareScreen(userId: string | number, size: {width: number, height: number}) {
    return {
      command: rtmTextMessageCategory.READY_SHARE_SCREEN,
      userId, size
    }
  }

  /**
   * 告诉远端，你现在需要开始共享屏幕
   *
   * @param {(string | number)} userId
   * @return {*}
   * @memberof HomeService
   */
  sendStartShareScreen(userId: string | number) {
    return {
      command: rtmTextMessageCategory.START_SHARE_SCREEN,
      userId: localCode,
      remoteUserId: userId
    }
  }
  handleSendKeyboard(data: any, userId: any) {
    return {
      command: rtmTextMessageCategory.KEYBOARD_DOWN,
      userId: userId,
      robot: data
    }
  }
  handleSendMouse(data: any, userId: any) {
    return {
      command: rtmTextMessageCategory.MOUSE_CLICK,
      userId: userId,
      robot: data
    }
  }

  listenMouseAndKeyEvent(userId: any, agoraRTMService: AgoraRTMService) {
    // 监听键盘按下事件
    window.onkeydown = (e) => {
      let data = {
          keyCode: e.keyCode,
          shift: e.shiftKey,
          alt: e.altKey,
          ctrl: e.ctrlKey,
          meta: e.metaKey
      }
      console.log('onkeydown:', this.handleSendMouse);
      agoraRTMService.sendMessage(this.handleSendKeyboard(data, userId));
    }
    // 监听鼠标点击事件
    window.onmouseup = (e) => {
      const target = e.target;
      const videoObj = document.getElementsByTagName('video')[0];
      const zoomCanvas = parseInt(videoObj.style.zoom);
      const videoWidth = videoObj.offsetWidth * zoomCanvas;
      const videoHeight = videoObj.offsetHeight * zoomCanvas;
      if(target == videoObj) {
        const clientX = e.clientX - (videoObj.getBoundingClientRect().left == 0? videoObj.getBoundingClientRect().left: videoObj.getBoundingClientRect().left * zoomCanvas);
        const clientY = e.clientY - (videoObj.getBoundingClientRect().top == 0?videoObj.getBoundingClientRect().top: videoObj.getBoundingClientRect().top * zoomCanvas);
        let data = {
          clientX,
          clientY,
          screen: {
            width: 0,
            height: 0
          },
          video: {
            width: videoWidth,
            height: videoHeight
           }
        };
        // peer.emit('robot', 'mouse', data)
        console.log('onmouseup:', this.handleSendMouse, data);
        agoraRTMService.sendMessage(this.handleSendMouse(data, userId));
        ;
      }
    }
  }
}
