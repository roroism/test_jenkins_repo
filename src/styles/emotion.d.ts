import '@emotion/react';

/**
 * darkmode에서 사용하기 위한 Theme 타입 정의
 *
 * @author roro 2023.07.13
 */
declare module '@emotion/react' {
  export interface Theme {
    mode: {
      text: string;
      textAside: string;
      background: string;
      backgroundAside: string;
      backgroundAsideHover: string;
      backgroundSelectedAsideGroup: string;
      backgroundHomeItem: string;
      backgroundNavMenu: string;
      backgroundNavMenuHover: string;
      // buttonText: string;
      // buttonTextHover: string;
      // buttonBorder: string;
      // buttonBg: string;
      // buttonBgHover: string;
      iconAside: string;
      iconActionButton: string;
      iconActionButtonHover: string;
      borderAside: string;
      borderBottomBaseNavBar: string;
      actionButtonBorder: string;
      actionButtonBorderHover: string;
      actionButtonBackground: string;
      actionButtonBackgroundHover: string;
      tableTrBackgroundHover: string;
      tableTrBorderBottom: string;
      darkmodeSwitch: string;
      modalBackground: string;
      previewBackground: string;
    };
    modeTransition: {
      duration: string;
    };
    isDarkmode: boolean;
  }
}
