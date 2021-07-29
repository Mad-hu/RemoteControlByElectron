export interface RtmTextMessageCategory {
  /**
   * ready shanre screen
   **/
   READY_SHARE_SCREEN: string,
  /**
   * start shanre screen
   **/
  START_SHARE_SCREEN: string,
  /**
   * stop share screen
   **/
  STOP_SHARE_SCREEN: string,
  /**
   * mouse move
   **/
  MOUSE_MOVE: string,
  /**
   * mouse click
   **/
  MOUSE_CLICK: string,
  /**
   * mouse double click
   **/
  MOUSE_DOUBLE_CLICK: string,
  /**
   * keyboard down
   **/
  KEYBOARD_DOWN: string,
  /**
   * leave channel
   **/
  LEAVE_CHANNEL: string,
  /**
   * join channel
   **/
  JOIN_CHANNEL: string,
  /**
   * member count update channel
   **/
  MEMBER_COUNT_UPDATE_CHANNEL: string
  /**
   * attributesUpdated
   **/
  ATTRIBUTES_UPDATED: string
}
