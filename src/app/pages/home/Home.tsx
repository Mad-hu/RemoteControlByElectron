import { ipcRenderer } from 'electron';
import React from 'react';
import { lastValueFrom } from 'rxjs';
import { MainCenter } from '../../components/home/main-center';
import { TitleBar } from '../../components/title/title-bar';
import { appid } from '../../services/agora/agora-appid.service';
import AgoraRTCService from '../../services/agora/agora-rtc.service';
import AgoraRTMService from '../../services/agora/agora-rtm.service';
import { HomeService } from '../../services/home/home.service';

export default class Home extends React.Component {
  localCode: number;
  agoraRTCService = new AgoraRTCService();
  agoraRTMService = new AgoraRTMService();
  homeService = new HomeService();
  constructor(
    props: any
  ) {
    super(props);
    this.localCode = this.homeService.getLocalCode();
  }
  componentDidMount() {
    ipcRenderer.send('show');
    this.initAgora();
  }
  componentWillUnmount() {
    this.agoraRTMService.leaveChannel();
    this.agoraRTMService.leaveChannel();
  }
  async initAgora() {
    const channel = this.homeService.getChannel();
    try {
      await lastValueFrom(this.agoraRTCService.init(appid));
      await lastValueFrom(this.agoraRTCService.join(channel, `${this.localCode}`));

      this.agoraRTMService.init(appid);
      await this.agoraRTMService.login(`${this.localCode}`);
      this.agoraRTMService.createChannel(channel);
      this.agoraRTMService.joinChannel();
    } catch (error) {
      console.log('initAgora:', error);
    }
  }

  render() {
    return (
        <div className="home">
          <TitleBar></TitleBar>
          <MainCenter
            localCode={this.localCode}
            agoraRTCService ={this.agoraRTCService}
            agoraRTMService ={this.agoraRTMService}
            homeService ={this.homeService}
          ></MainCenter>
        </div>

    );
  }
}
