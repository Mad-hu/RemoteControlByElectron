import AgoraRTC, { ClientConfig, IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

export let shareTrack: any;
export let rtcClient!: IAgoraRTCClient;

export const setShareTrack = (track: ILocalVideoTrack | undefined) => {
  shareTrack = track;
}
export const init = (clientConfig: ClientConfig = { mode: 'rtc', codec: 'vp8' }) => {
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
  shareTrack = await AgoraRTC.createScreenVideoTrack({electronScreenSourceId: screenId});
  if(shareTrack.length == 2) {
    return {shareTrack: shareTrack[0], size: screenSource[0].thumbnail.getSize()};
  }
  return {shareTrack, size: screenSource[0].thumbnail.getSize()};
}
const getScreenSource = () => {
  return AgoraRTC.getElectronScreenSources('screen');
}
