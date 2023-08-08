import IMG_Delete from '@app/resources/icons/trashcan.png';
import {
  getAssetUploadPolicy,
  mediaAnalyzingProxyAddressGetter,
  putAsset,
  uploadAssetToCDN,
  uploadAssetToLocalServer,
} from '@app/src/apis/assets/assetApi';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { config } from '@app/src/config';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { store } from '@app/src/store';
import { ModalProps } from '@app/src/store/model';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { nanoid } from 'nanoid';

import React, { useState } from 'react';
import * as S from './AssetUploadDialog.style';

type AssetUploadDialogProps = {
  closeDialog?: Function;
} & ModalProps;

type MetaFile = {
  id: string;
  isUploadFailed: boolean;
  file: File;
};

const availableMimeTypes = [
  //
  'video/mp4',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/jpg',
];

export function AssetUploadDialog(props: AssetUploadDialogProps) {
  const { closeDialog, closeSelf } = props;

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isUploading, setIsUpLoading] = useState(false);
  const [metaFiles, fileActions] = useTypeSafeReducer(
    [] as MetaFile[],
    {
      addFiles: (state, fileList: FileList) => {
        for (const file of fileList) {
          state.push({ id: nanoid(), isUploadFailed: false, file });
        }
      },
      remove: (state, id: string) => {
        const index = state.findIndex((item) => item.id === id);
        if (index < 0) return state;
        state.splice(index, 1);
      },
      update: (state, metaFile: MetaFile) => {
        const index = state.findIndex((item) => item.id === metaFile.id);
        if (index < 0) return state;
        state[index] = metaFile;
      },
      onUploadFailed: (state, id: string) => {
        const index = state.findIndex((item) => item.id === id);
        if (index < 0) return state;
        state[index].isUploadFailed = true;
      },
    },
    (state) => [...state]
  );

  const uploadToCloud = async () => {
    let hasFailure = false;
    setIsUpLoading(true);

    // const uri = config.EXTERNAL.CUBLICK.PRESENTATION.STOREPREASSET;
    // await Promise.allSettled(
    //   metaFiles.map((metaFile) =>
    //     getAssetUploadPolicy(metaFile.file.name)
    //       .then((policy) => uploadAssetToCDN(policy, metaFile.file))
    //       .catch(() => uploadAssetToLocalServer(metaFile.file))
    //       .then(async (response) => {
    //         console.log('response : ', response);

    //         const formData = new FormData();
    //         formData.append('image', metaFile.file);
    //         formData.append('NER', 'True');

    //         let target_asset_info = response;
    //         let proxy_url = 'https://api-service.cublick.com/v1/auth/ngrokMapping?portNumber=2728';
    //         await axios
    //           .get(proxy_url, {
    //             headers: { 'X-Access-Token': store.getState().appAuth.token },
    //           })
    //           .then((proxy_url_response) => {
    //             console.log('response.data : ', proxy_url_response.data);
    //             axios
    //               .post(`${proxy_url_response.data.ngrokAddress}/Input_image`, formData, {
    //                 headers: { 'Content-Type': 'multipart/form-data' },
    //               })
    //               .then((media_analyze_response: any) => {
    //                 let analyzed_media = media_analyze_response.data.description;
    //                 console.log('target_asset_info : ', target_asset_info);
    //                 console.log('analyzed_media : ', analyzed_media);
    //                 putAsset(response.id, { desc: analyzed_media });
    //                 queryClient.invalidateQueries(['assets']);
    //               })
    //               .catch((error) => {
    //                 console.error('error occured while analyzing media', error);
    //               });
    //           });

    //         fileActions.remove(metaFile.id);
    //       })

    //       .catch(() => {
    //         fileActions.onUploadFailed(metaFile.id);
    //         hasFailure = true;
    //       })
    //   )
    // );

    /**
     * 병렬적으로 업로드를 진행하고 싶다면 아래와 같이 사용하면 된다.
     */

    await Promise.allSettled(
      metaFiles.map((metaFile) =>
        getAssetUploadPolicy(metaFile.file.name)
          .then((policy) => uploadAssetToCDN(policy, metaFile.file))
          .catch(() => uploadAssetToLocalServer(metaFile.file))
          .then(() => fileActions.remove(metaFile.id))
          .catch(() => {
            fileActions.onUploadFailed(metaFile.id);
            hasFailure = true;
          })
      )
    );
    /**
     * 순차적으로 업로드를 진행하고 싶다면 아래와 같이 사용하면 된다.
     */
    // for (const metaFile of metaFiles) {
    //   try {
    //     await uploadAssetToLocalServer(metaFile.file);

    //     fileActions.remove(metaFile.id);
    //   } catch (error) {
    //     hasFailure = true;
    //     fileActions.onUploadFailed(metaFile.id);
    //   }
    // }

    setIsUpLoading(false);
    if (hasFailure) return;
    queryClient.invalidateQueries(['assets']);
    closeDialog?.(false);
    closeSelf?.();
  };

  const onCloseClick = () => {
    if (isUploading) return;
    closeDialog?.(false);
    closeSelf?.();
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={onCloseClick} />
      <Modal.Body>
        <Modal.Title>{t('app-asset.add')}</Modal.Title>
        <Modal.Content>
          <Layout.Box mb='20px'>
            <S.Input
              id='input-file'
              type='file'
              onChange={(e) => fileActions.addFiles(e.target.files)}
              accept={availableMimeTypes.join(', ')}
              multiple
              autoFocus
              disabled={isUploading}
            />
            <S.Label
              htmlFor='input-file'
              onDrop={(e) => {
                e.preventDefault();
                fileActions.addFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
              disabled={isUploading}
            >
              <span>{t('app-asset.add.desc')}</span>
            </S.Label>
          </Layout.Box>
          <S.Ul>
            {metaFiles.map((metaFile) => (
              <S.Li key={metaFile.id} error={metaFile.isUploadFailed}>
                <h3>{metaFile.file.name}</h3>
                {metaFile.isUploadFailed ? (
                  // TODO: translation required
                  <h4>업로드를 실패하였습니다.</h4>
                ) : (
                  <h4>{metaFile.file.type}</h4>
                )}
                <button onClick={() => fileActions.remove(metaFile.id)}>
                  <img src={IMG_Delete} alt='delete-single-asset' />
                </button>
              </S.Li>
            ))}
          </S.Ul>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton disabled={isUploading} onClick={uploadToCloud}>
            {t('app-common.save')}
          </Modal.SaveButton>
          <Modal.CloseButton disabled={isUploading} onClick={onCloseClick}>
            {t('app-common.close')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
