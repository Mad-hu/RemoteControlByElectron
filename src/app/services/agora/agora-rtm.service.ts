import AgoraRTM, { RtmChannel, RtmClient, RtmEvents, RtmTextMessage } from 'agora-rtm-sdk';
import { EventEmitter } from 'events';
import { RtmTextMessageCategory } from '../../interface/agora-rtm';
export const rtmTextMessageCategory: RtmTextMessageCategory = {
  READY_SHARE_SCREEN: 'READY_SHARE_SCREEN',
  /* start shanre screen */
  START_SHARE_SCREEN: 'START_SHARE_SCREEN',
  /* stop share screen */
  STOP_SHARE_SCREEN: 'STOP_SHARE_SCREEN',
  /* mouse move */
  MOUSE_MOVE: 'MOUSE_MOVE',
  /* mouse click */
  MOUSE_CLICK: 'MOUSE_CLICK',
  /* mouse double click */
  MOUSE_DOUBLE_CLICK: 'MOUSE_DOUBLE_CLICK',
  /* keyboard down */
  KEYBOARD_DOWN: 'KEYBOARD_DOWN',
  /* leave channel */
  LEAVE_CHANNEL: 'LEAVE_CHANNEL',
  /* join channel */
  JOIN_CHANNEL: 'JOIN_CHANNEL',
  /* member count update channel */
  MEMBER_COUNT_UPDATE_CHANNEL: 'MEMBER_COUNT_UPDATE_CHANNEL',
  /* attributesUpdated */
  ATTRIBUTES_UPDATED: 'ATTRIBUTES_UPDATED'
}
export default class AgoraRTMService extends EventEmitter {

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
    EventEmitter.defaultMaxListeners = 20;
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
    if (!this.rtmClient) {
      throw new Error('not find rtmClient! first please init rtm sdk!');
    };
    if (typeof (channel) != 'string') {
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
    if (!this.chan) {
      throw new Error('not find chan! first please create channel!');
    };
    /* 频道监听 */
    this.messageEvent();
    return this.chan.join();
  }

  /**
   * 离开频道
   *
   * @memberof AgoraRTMService
   */
  leaveChannel() {
    this.chan && this.chan.leave();
  }

  sendMessage(msg: any) {
    console.log('sendMessage:', { text: msg });
    return this.chan.sendMessage({ text: JSON.stringify(msg) });
  }

  messageEvent() {
    console.log('messageEvent init!');
    const channelMessage: keyof RtmEvents.RtmChannelEvents = 'ChannelMessage';
    const attributesUpdated: keyof RtmEvents.RtmChannelEvents = 'AttributesUpdated';
    const memberCountUpdated: keyof RtmEvents.RtmChannelEvents = 'MemberCountUpdated';
    const memberJoined: keyof RtmEvents.RtmChannelEvents = 'MemberJoined';
    const memberLeft: keyof RtmEvents.RtmChannelEvents = 'MemberLeft';

    this.chan.on(channelMessage, (message, memberId, messagePros) => {
      console.log('channelMessage:' ,message, memberId, messagePros);
      const jsonData = JSON.parse((<RtmTextMessage>message).text);
      const command: keyof RtmTextMessageCategory = jsonData.command;
      this.emit(command, jsonData);
    });
    this.chan.on(attributesUpdated, (attributes) => {
      console.log('attributesUpdated:', attributes);
      this.emit(rtmTextMessageCategory.ATTRIBUTES_UPDATED, attributes);
    });
    this.chan.on(memberCountUpdated, (attributes) => {
      console.log('memberCountUpdated:', attributes);
      this.emit(rtmTextMessageCategory.MEMBER_COUNT_UPDATE_CHANNEL, attributes);
    });
    this.chan.on(memberJoined, (attributes) => {
      console.log('memberJoined:', attributes);
      this.emit(rtmTextMessageCategory.JOIN_CHANNEL, attributes);
    });
    this.chan.on(memberLeft, (attributes) => {
      console.log('memberLeft:', attributes);
      this.emit(rtmTextMessageCategory.LEAVE_CHANNEL, attributes);
    });
  }
}
