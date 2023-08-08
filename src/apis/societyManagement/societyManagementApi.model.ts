export enum Level {
  USER = 'USER',
  MANAGER = 'MANAGER',
}

export type SocietyUserType = {
  userId: string;
  displayName: string;
  userName: string;
  level: Level;
  _id: string;
};

export type AddUser = {
  userId: string;
  level: Level.USER | Level.MANAGER;
};

export type categoryId = {
  categoryId: string;
  categoryName: string;
};

export type AddSocietyRequestBody = {
  name: string;
  userData: AddUser[];
  categoryIds: categoryId[];
};

export type CategoryInSociety = {
  categoryName: string;
  categoryId: string;
  _id: string;
};

export type SocietyManagementAPIResponse = {
  id: string;
  name: string;
  users: SocietyUserType[];
  categories: CategoryInSociety[];
  createdDate: Date;
  updatedDate: Date;
  _id: string;
};
