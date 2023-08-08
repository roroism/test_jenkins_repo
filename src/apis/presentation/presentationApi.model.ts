import {
  RawPresentationRegion,
  RawPresentationBackground,
  RawPresentationBackgroundAudio,
} from '@cublick/parser/models';

export type PresentationAPIResponse = {
  name: string;
  desc: string;
  lock: boolean;
  accessRight: number;
  orientation?: 'LANDSCAPE' | 'PORTRAIT';
  ratio: string;
  width: number;
  height: number;
  // tags: string[];
  // categories: string[];
  // status: 'ACTIVATED' | 'DEACTIVATED';
  status: 'ACTIVATED' | 'DELETED';
  viewCount: number;
  isPrivate: boolean;
  isSystem: boolean;
  isGridTpl: boolean;
  mobility: boolean;
  _id: string;
  taggedTags?: { tagId: string; tagName: string }[];
  styles?: {
    styleId: string;
    styleName: string;
  }[];
  moods?: {
    moodId: string;
    moodName: string;
  }[];
  price: number;
  /**
   * 생성일자
   * @format 2022-01-01T00:00:00.000Z
   */
  createdDate: Date;
  /**
   * 수정일자
   * @format 2022-01-01T00:00:00.000Z
   */
  updatedDate: Date;
  owner: {
    displayName: string;
    /**
     * _id와 id의 값은 같음
     */
    _id: string;
    id: string;
  };
  id: string;
};

export interface PresentationDesignData {
  bgAudio: {
    isRepeat: boolean;
    audios: any[];
  };
  bg: {
    type: 'COLOR' | 'IMAGE';
    id: string;
    md5: string;
    fileType: string;
    mimeType: string;
  };
  code: string;
  name: string;
  desc: string;
  lock: boolean;
  accessRight: number;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  ratio: string;
  width: number;
  height: number;
  bgAudioEnable: boolean;
  bgEnable: boolean;
  tags: any[];
  regions: RawPresentationRegion[];
  isPrivate: boolean;
  isSystem: boolean;
  payLevelAccess: string;
  isGridTpl: boolean;
  mobility: boolean;
  rules: any[];
  _id: string;
  assets: {
    name: string;
    id: string;
    md5: string;
    fileType: string;
    mimeType: string;
  }[];
  createdDate: string;
  updatedDate: string;
  id: string;
  multiVision: any;
}

export interface PresentationForUpload {
  code: string;
  name: string;
  desc: string;
  tags: string[];
  lock: boolean;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  ratio: string;
  width: number;
  height: number;
  bgAudioEnable: boolean;
  bgEnable: boolean;
  bg: RawPresentationBackground;
  bgAudio: RawPresentationBackgroundAudio;
  sharedList: {
    id: string;
    displayName: string;
  }[];
  mobility: boolean;
}
