import React, { useState } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as Layout from '@app/src/components/Layout.style';
import { ModalProps } from '@app/src/store/model';
import { ColorResult, RGBColor } from 'react-color';
import { hexaToRgba, rgbaToHexa } from '@app/src/utils';

type Props = ModalProps & {
  /**
   * @format #RRGGBBAA
   */
  defaultColor: string;
  /**
   * @param color format #RRGGBBAA
   */
  onSelected: (color: string) => void;
};

export function ColorPickDialog(props: Props) {
  const { closeSelf, defaultColor, onSelected } = props;

  const [color, setColor] = useState(hexaToRgba(defaultColor));

  const onColorChange = (color: ColorResult) => {
    setColor(color.rgb as Required<RGBColor>);
  };

  const onSaveClick = () => {
    onSelected(rgbaToHexa(color).substring(0, 7));
    closeSelf();
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body width='auto'>
        <Modal.Title>색 선택</Modal.Title>
        <Modal.Content>
          <Layout.ChromePicker color={color} onChange={onColorChange} />
        </Modal.Content>
        <Modal.Actions style={{ justifyContent: 'center' }}>
          <Modal.SaveButton onClick={onSaveClick}>적용</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
