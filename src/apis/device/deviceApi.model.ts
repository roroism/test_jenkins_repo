/** Response of `getDevice`. */
export type DevicesAPIDeviceResponse = {
  _id: string;
  pinCode: string;
  operationSystem: string;
  overlayingEvent: string;
  scheduleContent: string;
  shortDescription: string;
  snapshotPath: string;
  softwareVersion: string;
  snapshotDate: Date;
  updatedDate: Date;
  createdDate: Date;
  latestUptime: Date;
  activatedDate: Date;
  lastAccessDate: Date;
  bitUrl: string;
  producedDate: Date;
  autoActions: {
    /**
     * @format HH:mm
     */
    startTime: string;
    /**
     * @format HH:mm
     */
    endTime: string;
  }[];
  events: any[];
  playingList: {
    id: string;
    name: string;
  };
  playingContent: {
    name: string;
    id: string;
    type: string;
  };
  playingWidget: string;
  swVersion: string;
  defLanguage: string;
  osVersion: string;
  os: string;
  socketId: string;
  alignDisplay: string;
  autoScale: string;
  extraFuncsEnable: {
    customerAnalysis: boolean;
  };
  playStatus: string;
  liveStatus: 'ONLINE' | 'OFFLINE';
  status: 'ACTIVATED' | 'DEACTIVATED';
  isDim: boolean;
  isAutoLocate: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  totalStorage: number;
  freeStorage: number;
  accessToken: string;
  displayHeight: number;
  displayWidth: number;
  bluetoothMAC: string;
  macAddress: string;
  ipAddress: string;
  sharedList: any[];
  owner: {
    displayName: string;
    id: string;
  };
  desc: string;
  name: string;
  id: string;
  group: any;
  category: any[];
  content: any[];
  publicIpAddress: string;
  villageCode: any;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
};

/** Result of `getDevices`. */
export type DevicesAPIDeviceResult = {
  contentManagement: any;
  id: string;
  name: string;
  desc: string;
  owner: string;
  swVersion: string;
  playingContent: {
    name: string;
    type: string;
  };
  updatedDate: Date;
  liveStatus: 'ONLINE' | 'OFFLINE';
  group: any;
  category: any[];
  content: any[];
  status: any;
  villageCode: any;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  displayWidth: number;
  displayHeight: number;
};

type AlignOption =
  | 'TOP_LEFT'
  | 'TOP_CENTER'
  | 'TOP_RIGHT'
  | 'MIDDLE_LEFT'
  | 'MIDDLE_CENTER'
  | 'MIDDLE_RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_RIGHT'; // todo: check required

export type DeviceAPISingleDevice = {
  /**
   * 디바이스의 소유자
   * 이 디바이스를 등록한 사람의 정보로 추측됨
   */
  owner: {
    /**
     * 소유자의 ID
     */
    id: string;
    /**
     * 소유자의 이름
     */
    displayName: string;
  };
  /**
   * 디바이스가 위치한 곳의 위도와 경도
   * @todo 이 값이 어디에 사용되는지 확인 필요
   */
  location: {
    lognitute: number;
    latitude: number;
  };
  /**
   * @todo 이 값이 어디에 사용되는지 확인 필요
   */
  extraFuncsEnable: {
    customerAnalysis: boolean;
  };
  /**
   * 사용자가 지정한 디바이스의 이름
   */
  name: string;
  /**
   * 디바이스가 설치된 형태
   * @option 가로로 설치되어 있는 경우 `LANDSCAPE`
   * @option 세로로 설치되어 있는 경우 `PORTRAIT`
   */
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  /**
   * 디바이스에 대한 설명
   */
  isCategoryVisible: string;
  isWidgetVisible: string;
  builtinWidgetAddress: string;
  desc: string;
  address: string;
  ipAddress: string;
  macAddress: string;
  displayWidth: number;
  displayHeight: number;
  data: string;
  accessToken: string;
  totalStorage: number;
  freeStorage: number;
  isAuthLocate: boolean;
  autoRes: boolean;
  isDim: boolean;
  enaleNotification: boolean;
  enableAudience: boolean;
  enableDeviceStatus: boolean;
  enableLog: boolean;
  brightness: number;
  status: 'ACTIVATED' | 'DEACTIVATED' | 'DELETED' | 'WAITING_APPROVE' | 'NONE';
  liveStatus: 'ONLINE' | 'OFFLINE' | 'NONE';
  playStatus: 'NONE' | 'PLAY' | 'PAUSE' | 'IDLE' | 'SLEEP' | 'INIT';
  autoScale: 'ASPECT_RATIO' | 'FULL_STRETCH' | 'NONE'; // todo: check required. 'FILL_SCREEN'
  alignDisplay: AlignOption;
  alignOut: AlignOption;
  socketId: string;
  os: 'ANDROID';
  osVersion: string;
  defLanguage: string;
  swVersion: string;
  playingWidget: any[];
  publicIpAddress: string;
  _id: string;
  pinCode: string;
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  activatedDate: string;
  autoActions: {
    /**
     * @format HH:mm
     */
    startTime: string;
    /**
     * @format HH:mm
     */
    endTime: string;
  }[];
  categoryManagement: {
    id: string;
    name: string;
    type: 'CATEGORYMANAGEMENT';
    _id: string;
  }[];
  contentManagement: {
    id: string;
    name: string;
    type: 'CONTENTMANAGEMENT';
    /**
     * 해당 컨탠츠가 속해있는 카테고리의 ID
     */
    category: string;
    _id: string;
  }[];
  presentations: {
    id: string;
    name: string;
    type: 'PRESENTATION';
    category: string;
    _id: string;
  }[];
  assets: {
    id: string;
    name: string;
    type: 'ASSET';
    category: string;
    _id: string;
    startDate: string;
    endDate: string;
  }[];
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  createdDate: string;
  events: any[];
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  lastAccessDate: string;
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  latestUptime: string;
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  producedDate: string;
  rules: any[];
  sharedList: any[];
  /**
   * @format yyyy-MM-ddTHH:mm:ss.SSS[Z]
   */
  updatedDate: string;
  id: string;
  group: {
    /**
     * 디바이스가 속한 그룹(폴더)의 ID
     */
    id: string;
    /**
     * 디바이스가 속한 그룹(폴더)의 이름
     */
    name: string;
  };
};
