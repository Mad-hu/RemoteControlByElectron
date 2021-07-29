import { ipcRenderer } from 'electron';
import React from 'react';
import { lastValueFrom } from 'rxjs';
import { MainCenter } from '../../components/home/main-center';
import { TitleBar } from '../../components/title/title-bar';
import { appid } from '../../services/agora/agora-appid.service';
import { init, join, rtcClient } from '../../services/agora/agora-rtc-ng.service';
import AgoraRTMService from '../../services/agora/agora-rtm.service';
import { HomeService } from '../../services/home/home.service';

export default class Home extends React.Component {
  localCode: string;
  channel: string;
  agoraRTMService = new AgoraRTMService();
  homeService = new HomeService();
  constructor(props: any) {
    super(props);
    this.localCode = this.homeService.getLocalCode();
    this.channel = this.homeService.getChannel();
  }
  componentDidMount() {
    ipcRenderer.send('show');
    this.initAgora4();
  }
  componentWillUnmount() {
    this.agoraLeaveChannel();
  }
  async initAgora4() {
    init();
    await join(appid, this.channel, `${this.localCode}`);
    await this.initRTM();
  }
  async initRTM() {
    try {
      this.agoraRTMService.init(appid);
      await this.agoraRTMService.login(`${this.localCode}`);
      this.agoraRTMService.createChannel(this.channel);
      this.agoraRTMService.joinChannel();
    } catch (error) {
      console.log('Agora RTM init Error:', error);
    }
  }
  agoraLeaveChannel() {
    rtcClient.leave();
    this.agoraRTMService.leaveChannel();
  }

  render() {
    return (
        <div className="home">
          <TitleBar
            agoraLeaveChannel={this.agoraLeaveChannel.bind(this)}
          ></TitleBar>
          <MainCenter
            localCode={this.localCode}
            agoraRTMService ={this.agoraRTMService}
            homeService ={this.homeService}
          ></MainCenter>
        </div>

    );
  }
}
