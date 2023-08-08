import { APIList, DEFAULT_API_RES } from '@app/src/apis';
import { DevicesAPIDeviceResult, getAllDevices, updateDevice } from '@app/src/apis/device';
import { apiGroups, deleteGroup } from '@app/src/apis/group';
import { Group } from '@app/src/apis/group/groupApi.model';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Page from '@app/src/components/Page.style';
import { useModal } from '@app/src/hooks/useModal';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';
import { faFileSignature } from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faFolder } from '@fortawesome/pro-solid-svg-icons/faFolder';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DeviceNameChangeDialog } from '../DeviceNameChangeDialog/DeviceNameChangeDialog';
import { DeviceAddDialog } from '../DialogAddDialog';
import { FolderAddDialog } from '../FolderAddDialog/FolderAddDialog';
import { FolderNameChangeDialog } from '../FolderNameChangeDialog/FolderNameChangeDialog';

import * as S from './DeviceList.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { Carousel } from '@app/src/components/Carousel/Carousel';

/**
 * DB에서 절대로 지워지지 않는 rootGroup의 정보
 * 프론트에서는 이 정보가 DB에서 지워지지 않는다고 가정하고 사용한다.
 */
export const rootGroup = {
  id: '63e47b5eeb25d9165c77bd84',
  name: '265dc0064e22e32c522530f238c7bc1207f152',
};

export function DeviceList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [lastSelectedName, setLastSelectedName] = useState<string>('');
  const [openedGroupId, setOpenedGroupId] = useState<string | null>(rootGroup.id);
  const [isFolderCreateProcess, setIsFolderCreateProcess] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<DevicesAPIDeviceResult[]>([]);
  const selectedGroupIds = selectedGroups.map((group) => group.id);
  const selectedDeviceIds = selectedDevices.map((device) => device.id);
  const [selectedItems, setSelectedItems] = useState<(Group | DevicesAPIDeviceResult)[]>([]);
  const groupApi = useQuery({
    queryKey: ['group'],
    queryFn: () =>
      apiGroups({
        sort: '-createDate',
        order: 'DESC',
        filter: [{ key: 'contentType', operator: '=', value: 'DEVICE' }],
      }),
    initialData: DEFAULT_API_RES as APIList<Group>,
  });
  const allDevicesApi = useQuery({
    queryKey: ['device', 'all'],
    queryFn: () => getAllDevices(),
    select: (res) => res.data.filter((item) => item.status !== 'WAITING_APPROVE'),
    initialData: DEFAULT_API_RES as APIList<DevicesAPIDeviceResult>,
  });

  // const openFolderAddDialog = () => {
  //   modalCtrl.open(<FolderAddDialog />);
  //   // setIsFolderCreateProcess(true);
  // };

  // const openChangeFolderNameDialog = () => {
  //   if (selectedGroups.length === 0) {
  //     modalCtrl.open(<Alert text='이름을 변경할 폴더를 선택해주세요.' />);
  //     return;
  //   }

  //   modalCtrl.open(<FolderNameChangeDialog groupId={selectedGroups[0].id} />);
  // };

  const openChangeDeviceNameDialog = () => {
    if (selectedDevices.length === 0) {
      modalCtrl.open(<Alert text='이름을 변경할 기기를 선택해주세요.' />);
      return;
    }
    console.log('선택한 기기', selectedDeviceIds[0]);
    modalCtrl.open(<DeviceNameChangeDialog deviceId={selectedDeviceIds[0]} />);
  };

  // const openFolderDeleteConfirmDialog = () => {
  //   if (selectedGroups.length === 0) {
  //     modalCtrl.open(<Alert text='삭제할 폴더를 선택해주세요.' />);
  //     return;
  //   }

  //   if (selectedGroups.length > 1) {
  //     modalCtrl.open(<Alert text='폴더는 하나씩만 삭제가 가능합니다.' />);
  //     return;
  //   }

  //   if (allDevicesApi?.data.some((device) => device.group.id.id === selectedGroups[0].id)) {
  //     modalCtrl.open(<Alert text='폴더에 디바이스가 존재합니다.' />);
  //     return;
  //   }

  //   modalCtrl.open(
  //     <Confirm
  //       text='선택된 폴더를 제거하시겠습니까?'
  //       onConfirmed={async () => {
  //         let hasFailure = false;
  //         for (const group of selectedGroups) {
  //           try {
  //             await deleteGroup(group.id);
  //           } catch (error) {
  //             hasFailure = true;
  //           }
  //         }

  //         groupApi.refetch();
  //         if (!hasFailure) return;
  //         modalCtrl.open(<Alert text='삭제에 실패한 폴더가 있습니다.' />);
  //       }}
  //     />
  //   );
  // };

  const openDeviceDeleteConfirmDialog = () => {
    if (selectedDevices.length === 0) {
      modalCtrl.open(<Alert text='삭제할 디바이스를 선택해주세요.' />);
      return;
    }

    modalCtrl.open(
      <Confirm
        text='선택된 디바이스를 제거하시겠습니까?'
        onConfirmed={() => {
          updateDevice('deletes', { ids: JSON.stringify(selectedDeviceIds) }) //
            .catch(() => modalCtrl.open(<Alert text='디바이스 제거에 실패하였습니다.' />));
          allDevicesApi.refetch();
        }}
      />
    );
  };

  const selectGroup = (e: React.MouseEvent<HTMLLIElement>, group: Group) => {
    e.stopPropagation();
    setLastSelectedName(group.name);
    if (selectedGroupIds.includes(group.id)) {
      setSelectedGroups((prev) => prev.filter((item) => item.id !== group.id));
    } else {
      /**
       * Groupt을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      setSelectedGroups([group]);
      setSelectedDevices([]);
      /**
       * Asset을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // setSelectedGroups((prev) => [...prev, group]);
    }
  };

  const selectDevice = (e: React.MouseEvent<HTMLLIElement>, device: DevicesAPIDeviceResult) => {
    e.stopPropagation();
    setLastSelectedName(device.name);
    if (selectedDeviceIds.includes(device.id)) {
      setSelectedDevices((prev) => prev.filter((item) => item.id !== device.id));
    } else {
      /**
       * Device을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      setSelectedGroups([]);
      setSelectedDevices([device]);
      /**
       * Device를 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // setSelectedDevices((prev) => [...prev, device]);
    }
  };

  const openFolder = (groupId: string | null) => {
    setSelectedGroups([]);
    setOpenedGroupId(groupId);
  };

  const gotoDeviceDetail = (device: DevicesAPIDeviceResult) => {
    console.log('aaa', device);
    navigate(`/device/${device.id}`);
  };

  const openDeviceAddDialog = (openedGroupId: string) => {
    modalCtrl.open(<DeviceAddDialog groupId={openedGroupId} />);
  };

  const onFileGridClick = () => {
    setSelectedGroups([]);
    setSelectedDevices([]);
    setIsFolderCreateProcess(false);
  };
  console.log('livestatus : ', params.get('livestatus'));
  return (
    <Page.Container>
      <Page.Title>{t('app-device.deviceManagement')}</Page.Title>
      <Page.Actions>
        {/* <Page.ActionButton
          onClick={openFolderAddDialog} //
          disabled={openedGroupId !== rootGroup.id}
        >
          <FontAwesomeIcon icon={faFolder} />
          &nbsp; 폴더생성
        </Page.ActionButton> */}

        {/* <Page.ActionButton onClick={() => openChangeFolderNameDialog()}>
          <FontAwesomeIcon icon={faFileSignature} />
          &nbsp; 폴더명 변경
        </Page.ActionButton> */}

        <Page.ActionButton onClick={() => openChangeDeviceNameDialog()}>
          <FontAwesomeIcon icon={faFileSignature} />
          &nbsp; 기기명 변경
        </Page.ActionButton>

        {/* <Page.ActionButton
          onClick={openFolderDeleteConfirmDialog}
          disabled={openedGroupId !== rootGroup.id}
        >
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 폴더삭제
        </Page.ActionButton> */}

        <Page.ActionButton onClick={() => openDeviceAddDialog(openedGroupId)}>
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; 기기추가
        </Page.ActionButton>

        <Page.ActionButton onClick={openDeviceDeleteConfirmDialog}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 기기삭제
        </Page.ActionButton>
        <Page.SearchInput readOnly style={{ flex: 1 }} value={lastSelectedName} />
      </Page.Actions>
      {/* 기기목록 */}
      <S.FileGrid onClick={onFileGridClick}>
        {openedGroupId === rootGroup.id
          ? groupApi.data.data
              .filter((group) => group.id !== rootGroup.id)
              .map((group) => (
                <S.File
                  key={group.id}
                  onClick={(e) => selectGroup(e, group)}
                  onDoubleClick={() => openFolder(group.id)}
                  selected={selectedGroupIds.includes(group.id)}
                >
                  <S.FaFolderIcon icon={faFolder} />
                  <S.FileName>{group.name}</S.FileName>
                </S.File>
              ))
          : null}
        {openedGroupId !== rootGroup.id ? (
          <S.File onDoubleClick={() => openFolder(rootGroup.id)}>
            <S.FaReturnIcon icon={faEllipsisH} />
            <S.FileName>...</S.FileName>
          </S.File>
        ) : null}
        {params.get('livestatus')
          ? allDevicesApi?.data
              .filter((device) => device.group.id === openedGroupId)
              .filter((device) => device.liveStatus === params.get('livestatus').toUpperCase())
              .map((device) => (
                <S.File
                  key={device.id}
                  onClick={(e) => selectDevice(e, device)}
                  onDoubleClick={() => gotoDeviceDetail(device)}
                  selected={selectedDeviceIds.includes(device.id)}
                >
                  <S.FaDeviceIcon icon={faDesktop} online={device.liveStatus === 'ONLINE'} />
                  <S.FileName>{device.name}</S.FileName>
                </S.File>
              ))
          : allDevicesApi?.data
              .filter((device) => device.group.id === openedGroupId)
              .map((device) => (
                <S.File
                  key={device.id}
                  onClick={(e) => selectDevice(e, device)}
                  onDoubleClick={() => gotoDeviceDetail(device)}
                  selected={selectedDeviceIds.includes(device.id)}
                >
                  <S.FaDeviceIcon icon={faDesktop} online={device.liveStatus === 'ONLINE'} />
                  <S.FileName>{device.name}</S.FileName>
                </S.File>
              ))}
        {isFolderCreateProcess ? (
          <S.File>
            <S.FaFolderIcon icon={faFolder} color='#b0b0b0' />
            <S.FileNameInput />
          </S.File>
        ) : null}
      </S.FileGrid>
    </Page.Container>
  );
}
