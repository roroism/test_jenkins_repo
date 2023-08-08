import CUBLICK_APIS from './cublick-apis';
import GOOGLE_APIS from './google-apis';

export const config = {
  APP: {
    /** Browser session storage key. */
    STOR_KEY: {
      /** App authentication state. */
      AUTH: 'cbk-wa::user-session',
      BIS: 'cbk-wa::bis-session',
    },
  },

  EXTERNAL: {
    CUBLICK: CUBLICK_APIS,
    GOOGLE: GOOGLE_APIS,
  },
};
