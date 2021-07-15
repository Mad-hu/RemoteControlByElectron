import React from 'react';
import { MainCenter } from '../../components/home/main-center';
import AgoraRTCService from '../../services/agora/agora-rtc.service';
import AgoraRTMService from '../../services/agora/agora-rtm.service';
export default class Home extends React.Component {

  constructor(
    props: any,
    private agoraRTCService: AgoraRTCService,
    private agoraRTMService: AgoraRTMService
  ) {
    super(props);
  }

  render() {
    return (
      <div className="home">
        <MainCenter></MainCenter>
      </div>
    );
  }
}
