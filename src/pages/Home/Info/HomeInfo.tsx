import { getStorageData, getTotalContent, getTotalDevice } from '@app/src/apis/home/homeApi';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIList, DEFAULT_API_RES } from '@app/src/apis';
import { DevicesAPIDeviceResponse, DevicesAPIDeviceResult, getDevices } from '@app/src/apis/device';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import * as S from './HomeInfo.style';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const doughnutOptions = {
  // legend: { position: 'bottom', labels: { font: { size: 14 } } },
  events: [],
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  maintainAspectRatio: false,
};

export function HomeInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  /**
   * 사용처가 없어서 주석처리함 추후에 사용될 가능성이 있음
   */
  // const totalContent = useQuery({
  //   queryKey: ['totalContent'],
  //   queryFn: () => getTotalContent(),
  // });
  const totalDevice = useQuery({
    queryKey: ['totalDevice'],
    queryFn: () => getTotalDevice(),
  });
  const doughnutData = useQuery({
    queryKey: ['storageData', 'doughnutChart'],
    queryFn: () => getStorageData(),
    select: (data) => ({
      labels: [
        // `Total Storage : ${(data.totalStorage / Math.pow(1024, 3)).toFixed(2)} GB`,
        // `Used Storage : ${(data.usedStorage / Math.pow(1024, 3)).toFixed(2)} GB`,
        `Used Storage : ${(data.usedStorage / Math.pow(1024, 3)).toFixed(2)} GB`,
        `Usable Storage : ${((data.totalStorage - data.usedStorage) / Math.pow(1024, 3)).toFixed(
          2
        )} GB`,
      ],
      datasets: [
        {
          data: [data.usedStorage, data.totalStorage - data.usedStorage],
          backgroundColor: ['#CCC', '#42514d'],
          hoverBackgroundColor: ['#7b7576', '#222826'],
        },
      ],
      value: {
        storagePercent: Math.floor((data.usedStorage / data.totalStorage) * 100),
        totalStorage: Math.floor(data.totalStorage / Math.pow(1024, 3)),
        usedStorage: Math.floor(data.usedStorage / Math.pow(1024, 3)),
      },
    }),
  });
  const devicesApi = useQuery({
    queryKey: ['device', 'paginated'],
    queryFn: () =>
      getDevices({
        page: 1,
        perPage: 7,
        order: 'DESC',
        sort: '-liveStatus',
      }),
    initialData: DEFAULT_API_RES as APIList<DevicesAPIDeviceResult>,
  });

  const deviceCount = useMemo(() => {
    if (devicesApi.isLoading) {
      return {
        total: '...',
        online: '...',
        offline: '...',
      };
    }
    const totalCount = devicesApi.data.data.length;
    const onlineCount = devicesApi.data.data.filter(
      (device) => device.liveStatus === 'ONLINE'
    ).length;
    const offlineCount = totalCount - onlineCount;

    return {
      total: totalCount,
      online: onlineCount,
      offline: offlineCount,
    };
  }, [devicesApi]);

  console.log('doughnutData.data : ', doughnutData.data);
  return (
    <S.Container>
      <S.InfoItem to='/device' area='total'>
        <FontAwesomeIcon icon={faDesktop} size='4x' color='#3e70d6' />
        <span>{t('app-device.total')}</span>
        <h3>{deviceCount.total}</h3>
      </S.InfoItem>

      <S.InfoItem to='/device?livestatus=online' area='online'>
        <FontAwesomeIcon icon={faCheckCircle} size='4x' color='#009667' />
        <span>{t('app-HomeInfo.onlineDevices')}</span>
        <h3>{deviceCount.online}</h3>
      </S.InfoItem>

      <S.InfoItem to='/device?livestatus=offline' area='offline'>
        <FontAwesomeIcon icon={faTimesCircle} size='4x' color='#e85050' />
        <span>{t('app-HomeInfo.offlineDevices')}</span>
        <h3>{deviceCount.offline}</h3>
      </S.InfoItem>

      <S.TableWrapper area='list'>
        <S.TableTitle>{t('app-device.list')}</S.TableTitle>
        <S.Table>
          <S.THead>
            <S.Tr>
              <S.Th justifySelf='start'>{t('app-device.name')}</S.Th>
              <S.Th>{t('app-device.state')}</S.Th>
              <S.Th>{t('app-common.updateDate')}</S.Th>
            </S.Tr>
          </S.THead>
          <S.TBody>
            {devicesApi.data.data.map((device) => (
              <S.Tr key={device.id} data-device={device.id}>
                <S.Td justifySelf='start'>
                  <S.FaTdIcon icon={faDesktop} style={{ color: '#3e70d6' }} />
                  <span>{device.name}</span>
                </S.Td>
                {device.liveStatus === 'ONLINE' ? (
                  <S.Td>
                    <S.FaTdIcon icon={faCheckCircle} style={{ color: '#009667' }} />
                    {t('app-device.liveStatus-online')}
                  </S.Td>
                ) : null}
                {device.liveStatus === 'OFFLINE' ? (
                  <S.Td>
                    <S.FaTdIcon icon={faCheckCircle} style={{ color: '#bbb' }} />
                    {t('app-device.liveStatus-offline')}
                  </S.Td>
                ) : null}
                <S.Td>{dayjs(device.updatedDate).format('YYYY-MM-DD. HH:MM')}</S.Td>
              </S.Tr>
            ))}
          </S.TBody>
        </S.Table>
      </S.TableWrapper>

      <S.TableWrapper area='storage'>
        <S.TableTitle>{t('app-device.storage')}</S.TableTitle>
        {doughnutData.isLoading || doughnutData.data?.value.totalStorage === 0 ? (
          <S.StorageChartWrapper>
            <p>용량 정보를 알 수 없습니다</p>
          </S.StorageChartWrapper>
        ) : (
          <S.DoughnutWrapper
            storageText1={`${doughnutData.data?.value.storagePercent}%`}
            storageText2={`${doughnutData.data?.value.usedStorage} GB / ${doughnutData.data?.value.totalStorage} GB`}
          >
            {doughnutData.isSuccess ? (
              <Doughnut data={doughnutData.data} height={320} options={doughnutOptions as any} />
            ) : null}
          </S.DoughnutWrapper>
        )}
      </S.TableWrapper>
    </S.Container>
  );
}
