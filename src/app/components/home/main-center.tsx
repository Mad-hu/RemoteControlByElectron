import React from "react";
import { LoadingView } from "../loading-view/loading-view";
import { MainLeft } from "./main-left";
import { MainRight } from "./main-right";
import { ShareBox } from "./share-box";

export const MainCenter = () => {
  return (
    <div className="wrapper">
        <LoadingView></LoadingView>
        <div className='mainbox'>
          <main className="main">
            <MainLeft></MainLeft>
            <MainRight></MainRight>
          </main>
        </div>
        <ShareBox></ShareBox>
      </div>
  )
}
