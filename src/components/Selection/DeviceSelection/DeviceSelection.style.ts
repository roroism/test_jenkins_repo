import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Unit = styled.details`
  &[open] > summary > *:last-child {
    transform: rotate(-90deg);
  }
`;

export const FolderDrawer = styled.div`
  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

type FileProps = {
  /**
   * margin-left
   */
  ml?: string;
};

export const File = styled.div<FileProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  
  margin-left: ${(props) => props.ml || '0px'};

  &:hover {
    background-color: ${(props) => props.theme?.mode?.tableTrBackgroundHover};
  }
`;

export const FaFolderIcon = styled(FontAwesomeIcon)`
  font-size: 2rem !important;
  color: #f9d862;
`;

export const FileName = styled.span`
  display: inline-block;
  width: 65%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  vertical-align: middle;

  &.off {
    color: #bbb;
  }
`;

export const OrientationInfo = styled.span`
  display: inline-block;
  width: 25%;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1.4rem;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};

  &.off {
    color: #bbb;
  }
  & span {
    margin: 0;
    &.gray {
      color: #bbb;
    }
  }
`;

export const FaTdIcon = styled(FontAwesomeIcon)`
  height: 2.4rem;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const FaAngleLeft = styled(FontAwesomeIcon)`
  font-size: 1.8rem !important;
  color: #707070;
  transition: 300ms;
`;

interface DeviceLabelProps {
  active: boolean;
}

export const DeviceLabel = styled.label<DeviceLabelProps>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  font-size: 1.5rem;

  cursor: ${(props) => props.active ? 'pointer' : 'default'};
  & svg {
    margin-right: 5px;
  }
`;

export const SendImgInfoWrapper = styled.div`
  padding: 16px 16px 0;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};

  & dl {
    display: flex;
    padding-bottom: 10px;
    & dt {
      font-size: 14px;
    }
    & dd {
      font-size: 14px;
      margin-inline-start: 2px;
    }
  }
`;
