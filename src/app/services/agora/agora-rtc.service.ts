// import AgoraRTC, { ClientConfig } from 'agora-rtc-sdk';
// import { EventEmitter } from 'events';
// import { Observable } from 'rxjs';
// import { RtcMessageCategory } from '../../interface/agora-rtc';

// export const rtcMessageCategory: RtcMessageCategory = {
//   /**
//    * stream-published
//    */
//   STREAM_PUBLISHED: 'stream-published',
//   /*
//    * stream-added
//    */
//   STREAM_ADD: 'stream-added',
//   /*
//    * stream-subscribed
//    */
//   STREAM_SUBSCRIBED: 'stream-subscribed',
//   /*
//    * stream-removed
//    */
//   STREAM_REMOVED: 'stream-removed',
//   /*
//    * peer-leave
//    */
//   PEER_LEAVE: 'peer-leave',
// }
// export default class AgoraRTCService extends EventEmitter {
//   static remoteStream: AgoraRTC.Stream;
//   rtcClient!: AgoraRTC.Client;

//   init(appId: string, clientConfig: ClientConfig = { mode: 'live', codec: 'vp8' }) {
//     EventEmitter.defaultMaxListeners = 5;
//     this.rtcClient = AgoraRTC.createClient(clientConfig);
//     return new Observable(observer => {
//       this.rtcClient.init(appId, ()=> {
//         this.eventListen();
//         observer.next();
//         observer.complete();
//       }, (err)=> {
//         observer.error(err);
//         observer.complete();
//       })
//     })
//   }

//   join(channel: string, uid: any, tokenKey = null, optionalInf = undefined) {
//     return new Observable(observer => {
//       this.rtcClient.join(tokenKey, channel, uid, optionalInf, (uid: number) => {
//         observer.next();
//         observer.complete();
//       }, (err: string) => {
//         observer.error(err);
//         observer.complete();
//       });
//     })
//   }

//   /**
//    * 创建流媒体。exp:  {streamID: '123', audio: false, video: false, screen: true}
//    *
//    * @param {string} uid 流媒体id
//    * @param {boolean} [audio=false] 是否输出音频
//    * @param {boolean} [video=false] 是否输出视频
//    * @param {boolean} [screen=true] 是否共享桌面
//    * @return {*} 返回创建的音视频流
//    * @memberof AgoraRTCService
//    */
//   createStream( spec: AgoraRTC.StreamSpec) {
//     const stream = AgoraRTC.createStream(spec);
//     return stream;
//   }

//   /**
//    * 订阅一个远程流
//    *
//    * @param {AgoraRTC.Stream} stream 远端流对象，通过stream-added 监听获取。
//    * @param {boolean} [options={ video: true, audio: false }] 订阅远端流的音频/视频,视频包括屏幕
//    * @return {*}
//    * @memberof AgoraRTCService
//    */
//   subscribe(stream: AgoraRTC.Stream, options: { video: boolean, audio: boolean }) {
//     AgoraRTCService.remoteStream = stream;
//     return new Observable(observer => {
//       this.rtcClient.subscribe(stream, options, (err: string) => {
//         observer.error(err);
//         observer.complete();
//       });
//       observer.complete();
//     });
//   }
//   unsubscribe(stream: AgoraRTC.Stream) {
//     if(!stream) {
//       throw new Error('stream is ' + stream);
//     }
//     stream.stop();
//     this.rtcClient.unsubscribe(stream);
//   }
//   publish(stream: AgoraRTC.Stream) {
//     this.rtcClient.publish(stream, (err) => {
//       console.log('Publish local stream error: ' + err);
//     });
//   }
//   unpublish(stream: AgoraRTC.Stream) {
//     if(!stream) {
//       return;
//     }
//     this.rtcClient.unpublish(stream, (err) => {
//       console.log('Unpublish local stream failed' + err);
//     });
//   }
//   eventListen() {
//     this.rtcClient.on('error', (err: { reason: string; }) => {
//       console.error('RTC运行时异常' + err.reason);
//       if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
//         this.rtcClient.renewChannelKey( '', () => {
//         });
//       }
//     });

//     this.rtcClient.on('stream-published', (evt: any) => {
//       this.emit(rtcMessageCategory.STREAM_PUBLISHED, evt);
//     });
//     this.rtcClient.on('stream-added', (evt: { stream: any; }) => {
//       const stream = evt.stream;
//       this.emit(rtcMessageCategory.STREAM_ADD, stream);
//     });

//     this.rtcClient.on('stream-subscribed', (evt: { stream: any; }) => {
//       const stream = evt.stream;
//       this.emit(rtcMessageCategory.STREAM_SUBSCRIBED, stream);
//     });

//     this.rtcClient.on('stream-removed', (evt: { stream: any; }) => {
//       const stream = evt.stream;
//       this.emit(rtcMessageCategory.STREAM_REMOVED, stream);
//     });

//     this.rtcClient.on('peer-leave', (evt: { uid: string; reason: string; })=> {
//       this.emit(rtcMessageCategory.PEER_LEAVE, evt);
//     });
//   }

//   leave() {
//     return new Observable(observer => {
//       this.rtcClient && this.rtcClient.leave(() => {
//         observer.complete();
//       }, function (err: any) {
//         observer.complete();
//       });
//     })

//   }
// }
