import React from 'react';
import { BaseButton } from '../../components/home/base-button';
import { MainCenter } from '../../components/home/main-center';
import AgoraRTCService from '../../services/agora/agora-rtc.service';
import AgoraRTMService from '../../services/agora/agora-rtm.service';
import './Home.scss';
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
      <div className={'home'}>
        <MainCenter>
          <BaseButton></BaseButton>
        </MainCenter>

      </div>
    );
  }
}
