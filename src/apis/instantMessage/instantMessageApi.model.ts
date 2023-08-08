export type InstantMessageAPIResponse = {
  owner: {
    id: string;
    displayName: string;
  };
  isPrivate: true;
  isSystem: false;
  type: string;
  infoLevel: string;
  status: 'ACTIVATED' | 'DEACTIVATED';
  data: string;
  duration: number;
  _id: string;
  playTime: string;
  //playTime: Date;
  createdDate: Date;
  updatedDate: Date;
  name: string;
  id: string;
};

export type InstantMessageAPIResult = {
  owner: {
    id: string;
    displayName: string;
  };
  name: string;
  updatedDate: Date;
  data: string;
  id: string;
  playTime: Date;
  duration: number;
};

export type InstantmessageRequestBody = {
  name: string;
  eventType: 'INSTANT_MESSAGE';
  startDate: string;
  duration: number;
  iDList: undefined;
  data: InstantMessageDataType;
};

export interface InstantMessageDataType {
  message: string;
  fontSize: number;
  fontName: string;
  fontColor: string;
  bgColor: string;
  textEffect: {
    code: string;
    speed: number;
    repeat: boolean;
  };
  fontStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikeThrough: boolean;
  };
  align: AlignModeType;
  fullScreen: boolean;
  isSchedule: boolean;
  startDate: string;
  repeat: RepeatModeType;
  TTSEnable: boolean;
  TTSRepeat: boolean;
  TTSMsg: string;
  TTSVol: number;
  duration: number;
  x: number;
  y: number;
}

export type AlignModeType =
  | 'FULL'
  | 'TOP_LEFT'
  | 'TOP_CENTER'
  | 'TOP_RIGHT'
  | 'MIDDLE_LEFT'
  | 'MIDDLE_CENTER'
  | 'MIDDLE_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_RIGHT';

export type RepeatModeType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
