/**
 * @author 2022-11-22 Jongho <devfrank9@gmail.com>
 * @description cartSlice
 * cart에서 사용하는 redux store data의 로직을 관리합니다.
 * 개별 아이템 추가, 개별 아이템 제거, 전체 제거 를 정의합니다.
 */

import { ICart } from '@app/src/apis/shop/module';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartSliceState } from '../model';

const initialState: CartSliceState = {
  items: [], // 장바구니 아이템 리스트
  totalAmount: 0, // 장바구니 총 금액
  totalQuantity: 0, // 장바구니 총 수량
};

export const cartSlice = createSlice({
  name: 'cartBasket',
  initialState,
  reducers: {
    /**
     * @description 장바구니에 아이템 추가
     * @param state initialState
     * @param action ICart
     */
    addCarItem(state, action: PayloadAction<ICart>) {
      const item = action.payload;
      const itemIndex: number = state.items.findIndex((obj) => obj.id === item.id);

      // 장바구니에 아이템이 존재하는 경우 실행 끝
      if (itemIndex !== -1) return;
      // 장바구니에 아이템이 존재하지 않는 경우 실행
      else state.items.push(item);

      state.totalQuantity++;
      state.totalAmount += item.price;
    },

    /**
     * @description 장바구니에 아이템 제거
     * @param state initialState
     * @param action itemId
     */
    removeCarItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item: ICart | undefined = state.items.find((obj) => obj.id === id);
      if (item) {
        let itemsShallowArr: ICart[];
        itemsShallowArr = state.items.filter((obj) => obj.id !== id);
        const totalAmount = state.totalAmount - item.price;
        const totalQuantity = state.totalQuantity - 1;
        return { ...state, items: itemsShallowArr, totalAmount, totalQuantity };
      } else {
        return state;
      }
    },

    clearCart: (state, action: PayloadAction) => {
      return { ...initialState };
    },
  },
});

export const { addCarItem, removeCarItem, clearCart } = cartSlice.actions;
