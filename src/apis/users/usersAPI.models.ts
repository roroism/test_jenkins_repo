/** Response of `getDevice`. */
export type usersAPIResponse = {
  group: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    displayName: string;
  };
  agent: null;
  updater: {
    id: string;
    displayName: string;
  };
  displayName: string;
  userRight: string;
  payLevel: string;
  payPeriod: string;
  totalStorage: number;
  defLanguage: string;
  usedStorage: number;
  eCoinX: number;
  eCoinF: number;
  status: string;
  isEmailVerify: true;
  liveStatus: string;
  grade: number;
  avatarUrl: string;
  loginToken: string;
  emailVerifyToken: string;
  _id: string;
  email: string;
  username: string;
  lastAccessDate: string;
  updatedDate: string;
  createdDate: string;
  associatedUser: [];
  expiredDate: string;
  pushSubscriber: {
    keys: {
      p256dh: string;
      auth: string;
    };
    _id: string;
    endpoint: string;
  }[];
  socketIO: {
    _id: string;
    socketId: string;
  }[];
  vbank: [];
  totalDevice: string;
  subscribePromotion: boolean;
  ownedLicense: {
    _id: string;
    licenseCode: string;
    registerDate: string;
  }[];
  id: string;
};

export type userEdit = {
  id: string;
  displayName: string;
  userRight: string;
  payLevel: string;
  payPeriod: string;
  totalStorage: number;
  defLanguage: string;
  usedStorage: number;
  eCoinX: number;
  eCoinF: number;
  status: string;
  isEmailVerify: true;
  liveStatus: string;
  grade: number;
  avatarUrl: string;
  loginToken: string;
  emailVerifyToken: string;
  _id: string;
  email: string;
  username: string;
  lastAccessDate: string;
  updatedDate: string;
  createdDate: string;
  associatedUser: [];
  expiredDate: string;
  totalDevice: string;
  subscribePromotion: boolean;
  password?: string;
};

export type user = {
  id: string;
  username?: string;
  displayName: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  totalStorage?: number;
  defLanguage?: string;
  status?: string;
  userRight?: string;
  subscribePromotion?: boolean;
  totalDevice?: string;
  payLevel?: string;
  payPeriod?: string;
  expiredDate?: string;
};
