import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk';

export default class AgoraRTMService {

  /**
   * RTM 初始化后的对象
   */
  rtmClient!: RtmClient;
  /**
   * RTM 连接的频道
   */
  chan!: RtmChannel;

  /**
   * 初始化RTM
   *
   * @param {string} appid agroa后台创建项目后拿到的appid
   * @memberof AgoraRTMService
   */
  init(appid: string) {
    this.rtmClient = AgoraRTM.createInstance(appid);
  }
  /**
   * 初始化RTM后，使用唯一用户id登录RTM
   *
   * @param {string} uid 自定义用户id
   * @return {*} Promise 成功/失败
   * @memberof AgoraRTMService
   */
  login(uid: string) {
    return this.rtmClient.login({ uid });
  }
  /**
   * 创建频道
   *
   * @param {string} channel 频道名称
   * @memberof AgoraRTMService
   */
  createChannel(channel: string) {
    if(!this.rtmClient) {
      throw new Error('not find rtmClient! first please init rtm sdk!');
    };
    if(typeof(channel) != 'string') {
      throw new Error('channel is not string!');
    }
    this.chan = this.rtmClient.createChannel(channel);
  }

  /**
   * 加入频道
   *
   * @return {*}
   * @memberof AgoraRTMService
   */
  joinChannel() {
    if(!this.chan) {
      throw new Error('not find chan! first please create channel!');
    };
    return this.chan.join();
  }

  sendMessage(msg: any) {
    return this.chan.sendMessage({ text: msg});
  }
}
