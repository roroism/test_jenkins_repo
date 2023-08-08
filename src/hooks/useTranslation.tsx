import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const defaultMessage = '알맞은 번역이 없습니다.';
const defaultValues = { br: <br /> };

/**
 * 번역을 위한 커스텀훅, react-intl을 사용하여 번역을 처리하기 위한 로직을 단순화하기 위하여 작성.
 * 사용방법은 useIntl의 formatMessage와 파라미터의 위치만 다르고 동일함.
 * 추후 i18n을 위해 업그레이드 될 수 있는 여지가 있으므로, 번역 t 함수를 반환하는 것이 아닌 번역 t 함수를 담은 객체를 반환하도록 설계함.
 *
 * @author OH_jimin
 * @returns 번역을 위한 t 함수를 담은 객체
 * @example
 * const { t } = useTranslation();
 * return (
 *    <>
 *      <h1>{t('app-common.close')}</h1>
 *      <p>{t('app-common.close', { br: <br /> })}</p>
 *    </>
 * )
 */
export function useTranslation() {
  const { formatMessage } = useIntl();

  const t = (id: string, values?: any) => {
    return formatMessage({ id, defaultMessage }, { ...defaultValues, ...values });
  };

  const tForNested = useCallback(
    (prefix = '', obj: any) => {
      const resultObj: any = {};

      Object.keys(obj).forEach((k: string | any) => {
        const id = `${prefix}.${k}`;
        if (typeof obj[k] === 'string') {
          const text = formatMessage({ id, defaultMessage }, { ...defaultValues });
          resultObj[k] = text;
          return;
        }

        const nestedObj = obj[k];
        resultObj[k] = tForNested(id, nestedObj);
      });

      return resultObj;
    },
    [formatMessage]
  );

  return { t, tForNested };
}

/**
 * useTranslation의 내부 로직을 분리하여 번역을 위한 컴포넌트에서 사용할 수 있도록 작성.
 * useTranslation과 동일한 방식으로 사용할 수 있으며, useTranslation을 사용하는 것을 권장함.
 * useTranslation을 사용할 수 없는 class컴포넌트인 경우에만 사용할 것.
 *
 * @author OH_jimin
 * @returns 번역을 위한 t 함수
 * @example
 * class MyComponent extends React.Component {
 *    private t = getTranslator();
 *
 *    render() {
 *      return (
 *        <>
 *          <h1>{this.t('app-common.close')}</h1>
 *          <p>{this.t('app-common.close', { br: <br /> })}</p>
 *        </>
 *      )
 *    }
 * }
 */
export function getTranslator() {
  const t = (id: string, values?: any) => {
    return (
      <FormattedMessage
        id={id}
        defaultMessage={defaultMessage}
        values={{ ...defaultValues, ...values }}
      />
    );
  };

  return t;
}
