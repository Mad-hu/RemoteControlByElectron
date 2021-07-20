import React from "react";
import { useRecoilValue } from "recoil";
import { MainCenterProps } from "../../services/home/home.service";
import { controlShowViewState } from "../../services/state-manage/home.state.service";
import { LoadingView } from "../loading-view/loading-view";
import { MainLeft } from "./main-left";
import { MainRight } from "./main-right";
import { ShareBox } from "./share-box";

export const MainCenter = (props: MainCenterProps) => {
  const controlShowView = useRecoilValue(controlShowViewState);
  return (
    <div className="wrapper">
        <LoadingView></LoadingView>
        <div className='mainbox'>
          <main className="main">
            <MainLeft></MainLeft>
            <MainRight {...props}></MainRight>
          </main>
        </div>
        {
          controlShowView? <ShareBox {...props}></ShareBox> : null
        }
      </div>
  )
}
