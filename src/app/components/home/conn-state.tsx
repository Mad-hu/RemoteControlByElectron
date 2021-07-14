import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { connectionState } from "../../services/state-manage/home.state.service"

export const ConnState = () => {
  // const [connection, setConnection] = useRecoilState(connectionState);
  const connection = useRecoilValue(connectionState);
  return (
    <div>
      { connection }
    </div>
  )
}
