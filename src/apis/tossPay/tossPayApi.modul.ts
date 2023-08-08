export interface TossOrderRequestPrams {
  userId: string;
  totalAmount: number;
  discountAmount?: number;
  productDesc: string;
  products: {
    productId: string;
    amount: number;
    productDesc: string;
    ownerId: string;
    ownerName: string;
  }[];
}

export interface TossOrderStatusResponse {
  code: number; // 응답코드
  payToken: string; // 결제 고유 토큰
  orderNo: string; // 상점의 주문번호
  payStatus: string; // 결제 상태
  payMethod: string; // 결제 수단
  amount: number; // 결제 요청금액
  // 결제 트랜잭션 목록
  transactions: {
    // 어떤 용도인지 확인되지않음
    stepType: string;
    transactionId: string;
    transactionAmount: number;
    discountAmount: number;
    pointAmount: number;
    paidAmount: number;
    regTs: string;
  }[];
  createdTs: string; // 최초 결제요청 시간
  paidTs: string; // 결제 완료 시간
}
