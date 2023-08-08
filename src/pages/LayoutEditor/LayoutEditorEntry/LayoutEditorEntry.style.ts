import { Label as BaseLabel } from '@app/src/components/Form.style';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';

export const Title = styled.h1`
  font-size: 30px;
  text-align: center;
  color: #3e70d6;
`;

export const Body = styled.div`
  margin: 0px auto;
  max-width: 300px;
`;

export const TextLabel = styled(BaseLabel)`
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 55px;
  gap: 1.5rem;
`;

export const CreateButton = styled(Button)`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background: #7393d4;
  color: white;
  font-size: 14px;
  line-height: 35px;
  transition: 500ms;
  text-transform: none;

  &:hover {
    background: #3e70d6;
  }
`;
export const CancelButton = styled(CreateButton)`
  width: fit-content;
  min-width: 80px;
  background-color: #e8ba1f;
  &:hover {
    background-color: #f0cd3f; //#c99c00
  }
`;
