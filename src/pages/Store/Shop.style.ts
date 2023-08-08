import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  width: 100%;
`;

export const Inner = styled.div``;

export const GridScroll = styled.div`
  display: flex;
  /* @media screen and (max-width: 1025px) {
    height: 69vh;
  }
  @media screen and (min-width: 1026px) {
    height: 67vh;
  }
  @media screen and (min-width: 1440px) {
    height: 61vh;
  }
  @media screen and (min-width: 1920px) {
    height: 59vh;
  }
  overflow-y: scroll; */
`;

export const DataList = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(13.5rem, 28.5rem));
  column-gap: 4rem;
  row-gap: 5rem;
  width: 100%;
  margin: 0;
  padding: 0 1rem;
  grid-auto-flow: row;
`;
