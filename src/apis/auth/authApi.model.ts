export type AuthAPISignInParams = {
  username: string;
  password: string;
};

export type AuthAPISignInResponse = {
  avatarUrl: string;
  defLanguage: string;
  displayName: string;
  email: string;
  id: string;
  payLevel: string;
  token: string;
  userRight: 'END_USER' | 'MANAGER' | 'ADMIN';
  username: string;
};

export type AuthAPIPasswordResetEmailRequestParams = {
  email: string;
};

export type AuthAPISignUpParams = {
  username: string;
  password: string;
  email: string;
  phone: string;
  address: object;
  company: string;
  defLanguage: string;
};
