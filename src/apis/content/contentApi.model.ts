/** Response of ` `. */
export type ContentAPIResponse = {
  id: string;
  imageAlign: string;
  images: {
    id: string;
    name: string;
  }[];
  titleColor: string;
  titleBorder: boolean;
  textAlign: string;
  name: string;
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  startDate: string;
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  endDate: string;
  /**
   * @format #RRGGBB
   */
  textColor: string;
  /**
   * @format #RRGGBB
   */
  backgroundColor: string;
  owner: {
    displayName: string;
    id: string;
    username: string;
    _id: string;
  };
  data: {
    code: string;
    value: string;
  }[];
  updatedDate: Date;
  textForm: boolean;
  didInfo: string;
  category: string;
  categoryId: string;
  playingDevices: any[];
};

export type ContentAPISingle = {
  id: string;
  imageAlign: 'LEFT' | 'RIGHT' | 'BACKGROUND' | 'NONE';
  images: {
    id: string;
    name: string;
    // _id: string;
  }[];
  titleColor: string;
  titleBorder: boolean;
  textAlign: 'LEFT' | 'CENTER' | 'RIGHT' | '';
  name: string;
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  startDate: string;
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  endDate: string;
  /**
   * @format #RRGGBB
   */
  textColor: string;
  /**
   * @format #RRGGBB
   */
  backgroundColor: string;
  /**
   * 소유자의 displayName으로 추측됨
   */
  owner: string;
  data: {
    code: string;
    value: string;
    // _id: string;
  }[];
  /**
   * @format YYYY-MM-DDTHH:mm:ss.SSSZ
   */
  updatedDate: string;
  /**
   * @format YYYY-MM-DDTHH:mm:ss.SSSZ
   */
  createdDate: string;
  deptName: string;
  textForm: boolean;
  didInfo: string;
  category: string;
  categoryId: string;
  playingDevices: {
    deviceId: string;
    _id: string;
  }[];
  _id: string;
  status: string; // TODO: resolve what values are available
};

export type CreateContentParam = {
  /**
   * TODO: 정확히 무엇을 의미하는 것인지 알아볼 필요가 있음
   */
  backgroundColor: string;
  /**
   * 카테고리의 이름
   */
  category: string;
  /**
   * 카테고리의 ID
   */
  categoryId: string;
  /**
   * @TODO 정확히 무엇을 의미하는 것인지 알아볼 필요가 있음
   */
  data: {
    code: string;
    value: string;
  }[];
  /**
   * 부서의 이름 ( 유저의 이메일과 같음 )
   */
  deptName: string;
  /**
   * 보내려는 컨텐츠의 설명
   */
  didInfo: string;
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  endDate: string;
  /**
   * 이미지의 위치일 것으로 추측됨
   * @todo 정확히 무엇을 의미하는 것인지 알아볼 필요가 있음
   */
  imageAlign: 'LEFT' | 'RIGHT' | 'BACKGROUND' | 'NONE';
  images: {
    /**
     * 이미지의 ID
     */
    id: string;
    /**
     * 이미지의 이름
     */
    name: string;
  }[];
  /**
   * 컨텐츠의 이름
   */
  name: string;
  playingDevices: any[];
  /**
   * @format YYYY-MM-DDTHH:mm
   */
  startDate: string;
  textAlign: 'LEFT' | 'CENTER' | 'RIGHT' | '';
  /**
   * @format #RRGGBB
   */
  textColor: string;
  textForm: boolean;
  titleBorder: boolean;
  /**
   * @format #RRGGBB
   */
  titleColor: string;
};
