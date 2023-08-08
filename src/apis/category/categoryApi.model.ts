/** Response of ` `. */
export type CategoryAPIResponse = {
  id: string;
  name: string;
  speed: number;
  iconId: string;
  iconName: string;
  createdDate: Date;
  updatedDate: Date;
  owner: {
    displayName: string;
    id: string;
    username: string;
    _id: string;
  };
};

export type Category = {
  id: string;
  name: string;
  speed: number;
  iconName: string;
  iconId: string;
};
