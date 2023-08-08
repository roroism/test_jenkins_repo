import React from 'react';

import * as S from './Button.style';

export interface ButtonPropsType {
  title: string;
  icon?: React.ReactNode;
  colorType?: ButtonColorType;
  onClick: () => void;
  disabled: boolean;
}

const Button = ({ title, icon, onClick, colorType, disabled }: ButtonPropsType) => {
  const onClickHandle = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <S.Container disabled={disabled} colorType={colorType ?? 'none'} onClick={onClickHandle}>
      {icon}
      <S.ButtonText colorType={colorType ?? 'normal'}>{title}</S.ButtonText>
    </S.Container>
  );
};

export type ButtonColorType = 'normal' | 'blue' | 'red' | 'none';

export default Button;
