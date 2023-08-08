import { APIListParams } from '@app/src/apis';
import { useLayoutEffect, useState } from 'react';
import TransferList, { TransferListEnum } from '../TransferList/TransferList';
import React from 'react';
import { useUsersQuery } from '@app/src/apis/users/useUsersQuery';
import { usersAPIResponse } from '@app/src/apis/users/usersAPI.models';

const defaultAPIUsersParams: APIListParams = {
  perPage: 20,
  page: 1,
  sort: '-updatedDate',
  order: 'DESC',
  filter: [],
};

interface UserTransferListProps {
  editLeftItems: {
    leftItems: any;
    setLeftItems: React.Dispatch<React.SetStateAction<any>>;
  };
  editManager?: { selectedManagers: any; setSelectedManagers: any };
}

export default function UserTransferList({ editLeftItems, editManager }: UserTransferListProps) {
  const [params, apiActions, usersAPI] = useUsersQuery(defaultAPIUsersParams);
  const [allUsers, setAllUsers] = useState<usersAPIResponse[]>([]);

  useLayoutEffect(() => {
    console.log('useLayoutEffect usersAPI.data.data :: ', usersAPI.data.data);
    setAllUsers(usersAPI.data.data);
  }, [usersAPI.data.data]);

  console.log('usersAPI.data.data :: ', usersAPI.data);
  return (
    <>
      {allUsers.length > 0 && (
        <TransferList
          editLeftItems={editLeftItems}
          editRightItems={{
            rightItems: allUsers,
            setRightItems: setAllUsers,
          }}
          editManager={editManager}
          transferValue={TransferListEnum.user}
        />
      )}
    </>
  );
}
