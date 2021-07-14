import React from "react"

export const MainCenter = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined }) => {
  return (
    <div className={"main-center"}>
      {props.children}
    </div>
  )
}
