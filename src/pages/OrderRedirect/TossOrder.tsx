/**
 * @author 2022-11-22 Jongho <devfrank9@gmail.com>
 * @description ShopCart util
 * toss 결제가 완료 될시 retUrl로 이동하여
 * 해당 페이지에서 다음 로직을 처리합니다.
 * 1. 결제 성공 여부 확인
 * 2. 결제 성공시 결제 정보를 서버에 전송
 * 3. 결제 성공시 장바구니 비우기
 * 4. 결제 성공시 주문 내역 페이지로 이동
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { postTossPayApprove } from '@app/src/apis/tossPay/tossPay';
import { clearCart } from '@app/src/store/slices/cartSlice';
import * as S from './TossOrder.style';

export function TossOrder() {
  const [orderProcessInfo, setOrderProcessInfo] = React.useState({
    code: 9, // 0성공 -1 실패
    errorCode: '', // -1 실패시 코드
    msg: '', // -1 실패시 메시지
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    /**
     * @description 결제 성공시 결제 정보를 토스서버에 전송
     * @param {string} queryString 결제 정보 쿼리스트링
     * @returns {void}
     */
    postTossPayApprove(window.location.href)
      .then((res) => setOrderProcessInfo(res))
      .then(() => orderProcessInfo.code === 0 && clearCart());
  }, []);

  return (
    <S.Container>
      {orderProcessInfo.code === 9 ? (
        <S.Loading>Loading...</S.Loading>
      ) : orderProcessInfo.code === 0 ? (
        <S.OrderInfo>
          <p>결제가 성공했어요!</p>
          <button onClick={() => navigate('/shop')}>상품 더 보러가기</button>
          <button onClick={() => navigate('/my-platforms')}>내가 가진 디자인 보러가기</button>
        </S.OrderInfo>
      ) : (
        <S.OrderInfo>
          <p>결제에 실패했어요 ㅠㅠ</p>
          <button onClick={() => navigate('/cart')}>결제 다시 시도하기</button>
        </S.OrderInfo>
      )}
    </S.Container>
  );
}
