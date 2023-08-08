import { PresentationAPIResponse } from '@app/src/apis/presentation';
import React from 'react';
import * as Modal from '@app/src/components/Modal.style';
import { ModalProps } from '@app/src/store/model';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { store } from '@app/src/store';
import { postTossPayReady } from '@app/src/apis/tossPay/tossPay';

type props = {
  cartItem: PresentationAPIResponse[];
} & ModalProps;

export const ShopCart = (props: props) => {
  const { cartItem, closeSelf } = props;
  const { t } = useTranslation();

  const purchaseStart = () => {
    let totalPrice = 0;
    cartItem.map((x) => {
      totalPrice += x.price;
    });

    const params = {
      userId: store.getState().appAuth.userData.id,
      totalAmount: totalPrice,
      discountAmount: 0,
      productDesc: `${cartItem[0].name} 외 ${cartItem.length - 1}개`,
      products: cartItem.map((item) => {
        return {
          productId: item._id,
          amount: item.price,
          productDesc: item.name,
          ownerId: item.owner.id,
          ownerName: 'demo',
        };
      }),
    };
    console.log('aaaaaaaaa', params);

    postTossPayReady(params).then((res) => window.location.replace(res));
  }; //res는 서버에서 결제 정보를 받고 response로 준 url  };
  // 토스 결제 순서도 -> 연호
  console.log(cartItem);
  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body width='1000px' height='1300px'>
        <Modal.Title>{t('app-common.contentSelection')}</Modal.Title>
        <div>
          <div style={{ display: 'flex' }}>
            <div>이름</div>
            <div>가격</div>
          </div>
          {cartItem.map((item) => {
            return (
              <div style={{ display: 'flex' }}>
                <div>{item.name}</div>
                <div>{item?.price}원</div>
              </div>
            );
          })}
        </div>
        <Modal.Actions>
          <Modal.SaveButton onClick={purchaseStart}>결제하기</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>{t('app-common.close')}</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
};
