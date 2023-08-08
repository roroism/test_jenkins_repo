import { ICart } from '@app/src/apis/shop/module';
import { useShopList } from '@app/src/hooks/useShopList';
import { useState } from 'react';

type Prop = {
  saveSelectMedia?: Function; // 선택된 미디어 저장
  isSelect?: boolean; // 선택된 미디어 여부
};

export function Shop(props: Prop) {
  const [cartItems, setCartItems] = useState<ICart[]>([]); // 장바구니 아이템
  const [modalOpen, setModalOpen] = useState(false); // 모달 여부
  const [prstId, setPrstId] = useState(''); // 선택된 플렛폼 아이디
  const [searchString, setSearchString] = useState(''); // 검색어
  let { data, status, setPerPage, setPageNumber, perPage, refetch } = useShopList(searchString); // 데이터, 상태, 페이지네이션

  const multiSearchDataFetch = (multiSearchData) => {
    data = multiSearchData;
    console.log(data);
  };
}
