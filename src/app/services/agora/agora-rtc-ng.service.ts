import AgoraRTC, { ClientConfig, IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

export let shareTrack: ILocalVideoTrack | undefined;
export let rtcClient!: IAgoraRTCClient;

export const setShareTrack = (track: ILocalVideoTrack | undefined) => {
  shareTrack = track;
}
export const init = (clientConfig: ClientConfig = { mode: 'live', codec: 'vp8' }) => {
  rtcClient = AgoraRTC.createClient(clientConfig);
}
export const join = (appid: string, channel: string, uid: any, tokenKey = null) => {
  return rtcClient.join(appid, channel, tokenKey, uid);
}

export const getScreenTrack = async() => {
  const screenSource = await getScreenSource();
  let screenId = '';
  if(screenSource && screenSource.length != 0) {
    screenId = screenSource[0].id;
  }
  shareTrack = await AgoraRTC.createScreenVideoTrack({electronScreenSourceId: screenId}, 'disable');
  return shareTrack;
}
const getScreenSource = () => {
  return AgoraRTC.getElectronScreenSources('screen');
}
