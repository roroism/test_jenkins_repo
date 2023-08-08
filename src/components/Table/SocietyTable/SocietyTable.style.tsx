import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const THeadGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 25%; //grow shrink default-size
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 25%;
    word-wrap: break-word;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 25%;
    & ul {
      width: fit-content;
      text-align: left;
    }
  }
  & > *:nth-of-type(4) {
    flex: 1 1 25%;
    text-align: center;
  }
`;

export const TBodyGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 25%;
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 25%;
    word-wrap: break-word;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 25%;
    display: flex;
    justify-content: left;
    & ul {
      padding-left: 40%;
      width: fit-content;
      text-align: left;
    }
  }
  & > *:nth-of-type(4) {
    flex: 1 1 25%;
    text-align: center;
  }
`;

export const StyledLink = styled(Link)`
  color: ${(props) => props.theme?.mode?.text};
`;
