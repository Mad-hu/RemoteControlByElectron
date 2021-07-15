
import { Spin } from "antd";
import React from "react"
import { useRecoilValue } from "recoil";
import { loadingState } from "../../services/state-manage/home.state.service";

export const LoadingView = () => {
  const loadingStateValue = useRecoilValue(loadingState);
  return (
    loadingStateValue ?
      <div className="mask">
        <Spin size="large" />
      </div> :
    null
  )
}
