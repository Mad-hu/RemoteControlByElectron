import Modal from 'antd/lib/modal';
import { ipcRenderer } from "electron";
import React from "react";
import { useRecoilState } from 'recoil';
import { logoutState } from '../../services/state-manage/base.state.service';

export const LogoutView = () => {
  const [visible, setVisible] = useRecoilState(logoutState);
  const cannleAction = ()=> setVisible(false);
  const okAction = ()=> ipcRenderer.send('close');
  return(
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      width={250}
      bodyStyle={{borderRadius: '15px'}}
    >
      <div className='logout'>
        <div className='logout-title'>确定退出？</div>
        <div className='logout-btns'>
          <div className='logout-btn' onClick={cannleAction}>取消</div>
          <div className='logout-btn' onClick={okAction}>确定</div>
        </div>
      </div>
    </Modal>
  )
}
