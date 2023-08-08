/**
 * @author 2022-12-16 Jongho <devfrank9@gmail.com>
 * @description 토스페이에 보낼 api를 관리합니다.
 */
import axios from 'axios';
// 현재 인터페이스를 사용하지 않지만,
// http://tossdev.github.io 의 문서 참고하여 사용할 수 있습니다.
import { TossOrderRequestPrams } from './tossPayApi.modul';

// 토스페이 결제 1차 api
export const postTossPayReady = async (params: TossOrderRequestPrams) => {
  // 추후 body는
  // const body = { 총액, 주문서이름, 해당 주문건이 갖고있는 상품들: { 상품이름, 상품가격, 상품설명, 소유권자, 소유권자id }[] }
  // 위 와 같이 바뀔 예정입니다.
  // 현재 서버단에서 retUrl을 프론트 주소 기준으로 설정해놨는데,
  // development 환경에서는 file://로 설정되어있어
  // npm i -g http-server 로 로컬 서버를 띄워서 테스트해야합니다.
  // http-server는 현 레포지토리 루트로 cd 로 이동하여 실행합니다. 단순히 커맨드에 입력: http-server
  // production은 http://localhost:9000 이므로 배포시 백엔드 관리자에게 이야기 해야합니다.
  const res = await axios.post('http://192.168.0.88:5000/order', { params });
  return res.data;
};

// 위의 1차 api 요청을 보낸뒤, component/OrderRedirect/TossOrder.tsx 에서
// 아래 2차 api를 보내며, 결제 완료 혹은 실패를 확인합니다.
export const postTossPayApprove = async (queryUrl: string) => {
  const response = await axios.post('http://192.168.0.88:5000/success', { queryUrl });
  return response.data;
};

// TODO
// 앞으로 서버로 부터 추가될 것
// 결제 조회
// 환불
