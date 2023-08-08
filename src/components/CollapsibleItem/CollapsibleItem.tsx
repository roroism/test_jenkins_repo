import React, { useState } from 'react';

import * as S from './CollapsibleItem.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';

export interface CollapsibleItemPropsType {
  title: String; //펼치기 전에 보여질 title
  children: React.ReactNode; //item이 펼쳐졌을때 보여질 component
  defaultOpen?: boolean; //처음부터 열려있을것인지
}

const CollapsibleItem = ({ title, children, defaultOpen }: CollapsibleItemPropsType) => {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <S.Container>
      <S.TitleBox onClick={() => setOpen((prev) => !prev)}>
        <span>{title}</span>
        {open ? (
          <FontAwesomeIcon icon={faChevronDown} size='3x' />
        ) : (
          <FontAwesomeIcon icon={faChevronUp} size='3x' />
        )}
      </S.TitleBox>
      {open ? <S.CollapsibleContent>{children}</S.CollapsibleContent> : null}
    </S.Container>
  );
};

export default React.memo(CollapsibleItem);
