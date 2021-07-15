
import React from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { controlTextState, localCodeState, openMsgState, openState, remoteCodeState } from "../../services/state-manage/home.state.service"

export const MainRight = () => {
  const setRemoteCode = useSetRecoilState(remoteCodeState);
  const localCode = useRecoilValue(localCodeState);
  const open = useRecoilValue(openState);
  const openMsg = useRecoilValue(openMsgState);
  const controlText = useRecoilValue(controlTextState);
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoteCode(e.target.value);
  }
  const handleSubmit = () => {

  }
  return (
    <section className="content">
      <h1>您的ID:{localCode}</h1>
      <input id='roomid' type='text' className='input-t' onChange={inputChange} placeholder='请输入连接ID:'></input>
      <button className="btn" title='连接' onClick={handleSubmit}>连接</button>
      <div className="msg">
        <div className='msg-server'>
          <div className={open ? 'open-success': 'open-error'}></div>
          {openMsg}
        </div>
        <div>{controlText}</div>
      </div>
    </section>
  )
}
