import { toDivStyle } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input as BaseInput } from '@app/src/components/Form.style';

export const Conatiner = styled.div`
  display: flex;
  flex: 1;
`;

export const FileGrid = styled.ul`
  ${toDivStyle}

  flex:1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  justify-content: start;
  align-content: start;
  align-items: center;
  gap: 2rem;
`;

type FileProps = {
  selected?: boolean;
};

export const File = styled.li<FileProps>`
  ${toDivStyle}

  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    css`
      box-shadow: 0px 0px 5px 0px hsla(0, 0%, 75%, 1);
    `}
`;

type FileIconProps = {
  selected?: boolean;
};

export const FaFolderIcon = styled(FontAwesomeIcon) <FileIconProps>`
  font-size: 80px !important;
  color: #f9d862;
  transition: 300ms;
`;

type FaDeviceIcon = {
  online?: boolean;
};

export const FaDeviceIcon = styled(FontAwesomeIcon) <FileIconProps & FaDeviceIcon>`
  font-size: 80px !important;
  padding: 10px;
  color: ${(props) => (props.online ? '#3e70d6' : '#b0b0b0')};
  transition: 300ms;
`;

export const FaReturnIcon = styled(FontAwesomeIcon)`
  font-size: 30px !important;
`;

export const FileName = styled.h4`
  ${toDivStyle}

  font-size: 1.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const FileNameInput = styled(BaseInput)`
  width: 100%;
  height: 10px;
  font-size: 1.4rem;
  text-align: center;
`;
