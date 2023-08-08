// Modal ----------------------------------------
export type ModalProps = {
  modalId?: number;
  closeSelf?: () => void; // 모달 닫기
};

export type ModalType = {
  ui: JSX.Element;
  key: number;
};

// Shop ---------------------------------
/**
 * 장바구니 카트
 */
export interface ICart {
  // 장바구니 정보
  id: string; // 장바구니 아이템 id
  quantity: number; // 장바구니 아이템 수량
  name: string; // 장바구니 아이템 이름
  price: number; // 장바구니 아이템 가격
  owner: { displayName: string; id: string }; // 장바구니 아이템 소유자
}
/**
 * 장바구니 store의 state
 */
export interface CartSliceState {
  items: ICart[]; // 장바구니에 담긴 아이템들
  totalQuantity: number; // 아이템의 총 개수
  totalAmount: number; // 아아ㅣ템의 총 가격
}

// Presentation ---------------------------------
export type PrestCategory = {
  main: string;
  sub: string;
};

// Auth -----------------------------------------
export type AppAuthState = {
  token: JWT;
  userData: UserData;
};

/** App auth token. */
export type JWT = string;

/** App auth user data. */
export type UserData = {
  name: string;
  email: string;
  userRight: string;
  avatarUrl: string;
  lang: string;
  id: string;
};
