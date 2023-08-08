const __ = {
  // protocol: 'https',
  // hostname: 'api-service.cublick.com',
  // protocol: 'http',
  // hostname: 'localhost:8080',
  protocol: 'http',
  // hostname: 'localhost:97',
  // protocol: 'http',
  hostname: '192.168.0.32:97', //jonghyun's computer
  // protocol: 'http',
  // hostname: '192.168.0.88:97',
  // protocol: 'http',
  // hostname: '127.0.0.1:97',
  apiVersion: 1,
};

const __API_ROOT = `${__.protocol}://${__.hostname}`;
const __API_END_POINT = `${__API_ROOT}/v${__.apiVersion}`;

const CUBLICK_APIS = {
  _ROOT: __API_ROOT,
  _END_POINT: __API_END_POINT,

  CDN: 'https://storage.googleapis.com/cdn.cublick.com',

  AUTH: {
    /** [POST] Sign-in */
    SIGN_IN: __API_END_POINT + '/login',
    SIGN_SESSION: __API_END_POINT + '/loginWithBisSession',
  },
  FORGET: {
    FORGET_IN: __API_END_POINT + '/users/request_reset_password',
  },
  REGIST: {
    REGIST_IN: __API_END_POINT + '/users',
    REGIST_RE: __API_END_POINT + '/users/request_verify_email',
  },

  USER: {
    UDT: __API_END_POINT + '/auth/users',
  },

  HOME: {
    CONT: __API_END_POINT + '/auth/statistics/my_total_content',
    DEVS: __API_END_POINT + '/auth/statistics/my_total_device',
    STOR: __API_END_POINT + '/auth/statistics/my_coin_storage',
  },

  DEVICE: {
    SELF: __API_END_POINT + '/auth/devices',
    SEND: __API_END_POINT + '/auth/devices/request',
    ACTI: __API_END_POINT + '/auth/devices/activate',
  },

  CONTENT: {
    SELF: __API_END_POINT + '/auth/contentManagement',
    BROWSER: __API_END_POINT + '/auth/content/forBrowser',
    DELAYED: __API_END_POINT + '/auth/vSeven/list_of_delayed_com_eachContents?contentId=',
    DELLIST: __API_END_POINT + '/auth/vSeven/list_of_delayed_com_tradGetAll',
    REMOVED: __API_END_POINT + '/auth/vSeven/modifyStatus',
    THUMBNAIL: (id: string, access_token: string) => {
      return (
        __API_END_POINT +
        '/auth/contentManagement/' +
        id +
        '/thumbnail?access_token=' +
        access_token
      );
    },
  },

  CATEGORYMANAGEMENT: {
    SELF: __API_END_POINT + '/auth/categoryManagement',
  },

  SOCIETYMANAGEMENT: {
    ADD: __API_END_POINT + '/auth/society',
    SELF: __API_END_POINT + '/auth/societies',
  },

  PLAYLISTS: {
    PLS: __API_END_POINT + '/auth/playlists',
  },

  SCHEDULE: {
    SCH: __API_END_POINT + '/auth/schedules',
  },

  INSTANTMESSAGE: {
    ISM: __API_END_POINT + '/auth/display_events',
  },

  ASSET: {
    AST: __API_END_POINT + '/auth/assets',
    UPL: __API_END_POINT + '/auth/assets/upload/policy',
    AI: __API_END_POINT + '/auth/ngrokMapping?portNumber=3001',
    THUMBNAIL: (id: string, access_token: string) => {
      return __API_END_POINT + '/auth/assets/' + id + '/thumbnail?access_token=' + access_token;
    },
    ORIGINAL: (id: string, access_token: string) => {
      return __API_END_POINT + '/auth/assets/' + id + '/data?access_token=' + access_token;
    },
  },

  PRESENTATION: {
    PRE: __API_END_POINT + '/auth/presentations',
    STOREPRE: __API_END_POINT + '/auth/ngrokMapping?portNumber=3000',
    STOREPREASSET: __API_END_POINT + '/auth/ngrokMapping?portNumber=2728',
    DESIGNDATA: (id: string) => {
      return __API_END_POINT + '/auth/presentations/' + id + '/design';
    },
    ASSETLIST: (id: string) => {
      return __API_END_POINT + '/auth/presentations/' + id + '/assets';
    },
    UPLOAD_THUMBNAIL: (id: string) => {
      return __API_END_POINT + '/auth/presentations/' + id + '/thumbnail';
    },
    THUMBNAIL: (id: string, access_token: string) => {
      return (
        __API_END_POINT + '/auth/presentations/' + id + '/thumbnail?access_token=' + access_token
      );
    },
  },

  WIDGET: {
    BASE: __API_END_POINT + '/auth/widgets',
    WID: __API_END_POINT + '/auth/widget_instants',
    THUMBNAIL: (widget: string, jwt: string) =>
      __API_END_POINT + '/auth/widgets/' + widget + '/thumbnail?access_token=' + jwt,
    // BASE: 'https://api-test.cublick.com/v1' + '/auth/widgets',
    // WID: 'https://api-test.cublick.com/v1' + '/auth/widget_instants',
    // THUMBNAIL: (widget: string, jwt: string) =>
    //   'https://api-test.cublick.com/v1/auth/widgets/' +
    //   widget +
    //   '/en/thumbnail?access_token=' +
    //   jwt,
  },

  RULE: {
    BASE: __API_END_POINT + '/auth/rules',
    INST: __API_END_POINT + '/auth/rule_instants',
  },

  GROUP: {
    PBASE: __API_END_POINT + '/auth/parentGroups',
    BASE: __API_END_POINT + '/auth/groups',
  },

  SYSTEMLOGS: {
    SYSLOG: __API_END_POINT + '/auth/gokseongLogGetAll',
    TRANSLOG: __API_END_POINT + '/auth/transmission_logs',
    ERROR: __API_END_POINT + '/auth/vOne/list_of_delayed_com',
  },

  SERVICES: {
    PROXY: __API_END_POINT + '/services/proxy',
  },
};

('https://api-test.cublick.com/v1/login');

export default CUBLICK_APIS;
