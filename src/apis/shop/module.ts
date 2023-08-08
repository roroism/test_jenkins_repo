/**
 * @author 2022-12-16 Jongho <devfrank9@gmail.com>
 * @description Shop에서 사용하는 api의 요청, 응답의 타입을 관리한다.
 */

export interface IDataType {
  img?: string; // 프레젠테이션 img src주소
  name?: string; // 프레젠테이션 이름
  desc?: string; // 프레젠테이션 설명
  lock?: boolean; // 프레젠테이션 잠금 여부(수정 가능 여부)
  accessRight?: number; // 프레젠테이션 접근 권한
  orientation?: string; // 프레젠테이션 방향(가로/세로)
  ratio?: string; // 프레젠테이션 비율(4:3/16:9)
  width?: number; // 프레젠테이션 가로 크기
  height?: number; // 프레젠테이션 세로 크기
  tags?: string[]; // 프레젠테이션 태그들 (TODO: 태그 관리 로직 추가될 예정)
  status?: string; // 프레젠테이션 상태
  viewCount?: number; //  프레젠테이션 조회수
  isPrivate?: boolean; // 프레젠테이션 공개 여부
  isSystem?: boolean; // 프레젠테이션 시스템 여부(스탠드얼론? 클라우드?)
  isGridTpl?: boolean; // 프레젠테이션 그리드 여부
  mobility?: boolean; // 프레젠테이션 모바일 여부
  _id?: string; // 프레젠테이션 id
  createdDate?: string; // 프레젠테이션 생성일
  updatedDate?: string; // 프레젠테이션 수정일
  owner?: {
    // 프레젠테이션 소유자
    displayName?: string; // 소유자 이름
    _id?: string; // 소유자 id
    id?: string; // 소유자 id
  };
  id?: string; // 프레젠테이션 id
}

export interface IResponse {
  data: IDataType[]; // 상단 프레젠테이션 각 아이템 배열 담음
  pages?: {
    // 페이지 정보
    current?: number; // 현재 페이지
    prev?: number; // 이전 페이지
    hasPrev?: boolean; // 이전 페이지 존재 여부
    next?: number; // 다음 페이지
    hasNext?: boolean; // 다음 페이지 존재 여부
    total?: number; // 전체 페이지 수
  };
  items: {
    // 프레젠이션 전체 갯수 정보
    begin?: number; // 시작 인덱스
    end?: number; // 끝 인덱스
    total?: number; // 전체 갯수
  };
}

export interface IParms {
  // 프레젠테이션 리스트 조회 API 파라미터
  order?: 'ASC' | 'DESC'; // 정렬 방식
  page?: number; // 페이지 번호
  perPage?: number; // 페이지당 아이템 갯수
  sort?: string; // 정렬 기준
  filter?: {
    // 필터링 조건
    key?: string; // 필터링 기준
    operator?: string; // 필터링 연산자
    value?: string; // 필터링 값
  }[];
}

export interface ICart {
  // 장바구니 정보
  id: string; // 장바구니 아이템 id
  quantity: number; // 장바구니 아이템 수량
  name: string; // 장바구니 아이템 이름
  price: number; // 장바구니 아이템 가격
  owner: { displayName: string; id: string }; // 장바구니 아이템 소유자
}
