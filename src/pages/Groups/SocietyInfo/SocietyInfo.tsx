import React, { useMemo } from 'react';

import * as Page from '@app/src/components/Page.style';
import * as S from './SocietyInfo.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import Button from '@app/src/components/Button/Button';
import CollapsibleItem from '@app/src/components/CollapsibleItem/CollapsibleItem';
import { selectUserData } from '@app/src/store/slices/authSlice';
import SocietyUsersManage from '@app/src/components/Manage/SocietyUserManage/SocietyUserManage';
import SocietyCategoryManage from '@app/src/components/Manage/SocietyCategoryManage/SocietyCategoryManage';

const SocietyInfo = () => {
  const location = useLocation();
  const { id, societyName, users, categories } = location.state;
  // const { userRight } = useSelector(selectUserData());
  const onEdit = () => {};
  const onDelete = () => {};

  const collapsibleItem = [
    {
      title: '가입 요청',
      content: null,
      defaultOpen: true,
    },
    {
      title: '그룹 유저',
      content: <SocietyUsersManage users={users} />,
    },
    {
      title: '그룹 디바이스',
      content: null,
    },
    {
      title: '그룹 카테고리',
      content: <SocietyCategoryManage categories={categories} />,
    },
  ];

  // society의 수정, 삭제 권한이 있는지 계산
  // const { canEdit, canDelete } = useMemo(() => {
  //   const userLevel = right[userRight];
  //   const rightObj = { canEdit: false, canDelete: false };

  //   if (actionRight.society.edit >= userLevel) rightObj.canEdit = true;
  //   if (actionRight.society.delete >= userLevel) rightObj.canDelete = true;
  //   return rightObj;
  // }, [userRight]);

  return (
    <>
      <Page.Container>
        <S.Head>
          <div>
            <Page.Title>
              <S.Link to='/groups'>
                <FontAwesomeIcon icon={faAngleLeft} />
              </S.Link>
              {societyName}
            </Page.Title>
          </div>
          <S.ButtonBox>
            <Button title='수정' colorType='blue' onClick={onEdit} disabled={false} />
            <Button title='삭제' colorType='red' onClick={onDelete} disabled={false} />
          </S.ButtonBox>
        </S.Head>
        <S.Contents>
          {collapsibleItem.map((item, index) => (
            <CollapsibleItem key={`${item.title}-${index}`} {...item}>
              {item.content}
            </CollapsibleItem>
          ))}
        </S.Contents>
      </Page.Container>
    </>
  );
};

export default SocietyInfo;
