export interface Asset {
  name: string;
  value: number;
  tags: any[];
  //tags: string;
  srcType: string;
  fileType: string;
  // status: 'ACTIVATED' | 'DEACTIVATED';
  status: 'ACTIVATED' | 'DELETED';
  width: number;
  duration: number;
  height: number;
  md5: string;
  customTags: [];
  desc: string;
  size: number;
  downloadCount: number;
  srcLink: string;
  metaData: string;
  copyright: string;
  hasThumbnail: boolean;
  isPrivate: boolean;
  isSystem: boolean;
  _id: string;
  owner: {
    displayName: string;
    _id: string;
    id: string;
  };
  mimeType: string;
  // startDate: string;
  // endDate: string;
  createdDate: Date;
  updatedDate: Date;
  id: string;
  taggedTags?: { tagId: string; tagName: string }[];
  styles?: {
    styleId: string;
    styleName: string;
  }[];
  moods?: {
    moodId: string;
    moodName: string;
  }[];
}

export interface AssetUploadPolicy {
  key: string;
  bucket: string;
  googleAccessId: string;
  successActionStatus: string;
  successActionRedirect: string;
  policy: string;
  signature: string;
}
