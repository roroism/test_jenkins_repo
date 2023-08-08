import styled from '@emotion/styled';

export const Title = styled.div`
  font-size: 4rem;
  color: #303030;
  line-height: 5.8rem;
  text-align: left;
  font-weight: bold;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

export const Container = styled.div`
  display: block;
  position: relative;
  width: 100%;
  flex: 1;
  height: 80vh;
  min-width: 600px;

  @media screen and (min-width: 1440px) {
    display: flex;
  }
`;

export const LeftInner = styled.div`
  width: 100%;
  flex: 0.8;
  height: 55vh;
  overflow: scroll;

  @media screen and (min-width: 1440px) {
    width: 80%;
    height: 83vh;
    max-width: 1200px;
  }
`;

export const RightInner = styled.div`
  width: 100%;
  height: 30vh;
  flex: 0.2;
  padding: 0 2rem;

  @media screen and (min-width: 1440px) {
    width: 20%;
    height: 80vh;
    max-width: 400px;
  }

  .right-header {
    font-size: 3rem;
    font-weight: bold;
  }
  .price-calculator {
    font-size: 2rem;
    display: flex;
    justify-content: space-between;
  }
  .total-price {
    font-size: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: red;
    & > div {
      display: flex;
      align-items: center;
      > p:first-of-type {
        font-size: 3rem;
        font-weight: bold;
      }
    }
  }
  .purchase-button {
    text-align: center;
    button {
      font-size: 2rem;
      color: white;
      width: 100%;
      height: 5rem;
      background-color: red;

      &:hover {
        background-color: orangered;
        color: #0a84d2;
      }
    }
  }
`;

export const SelectInfoRow = styled.div`
  height: 5vh;
  background-color: #afaeae;
  display: flex;
  align-items: center;
  font-size: 1.5vh;
  margin-bottom: 2rem;
  border-top: 1px solid slategray;
  border-bottom: 1px solid slategray;

  input[type='checkbox'] {
    margin-left: 1rem;
    zoom: 2;
    cursor: pointer;
  }

  label {
    cursor: pointer;
  }

  p {
    margin: 0;
    cursor: pointer;
  }

  p:nth-of-type(3) {
    margin: 0 1rem;
  }
`;

export const Main = styled.div`
  min-width: 600px;
  max-width: 2000px;
  height: 70vh;
  overflow-y: scroll;
`;

export const CartEmptyMessage = styled.div`
  width: 100%;
  height: 58vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 3rem;

  p:last-child {
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: #0a84d2;
    }
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  border-top: 1px solid black;
  padding: 0 2rem;
`;

export const CardTitle = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  font-size: 4rem;
  margin-bottom: 2rem;
  input[type='checkbox'] {
    zoom: 1.5;
    cursor: pointer;
  }
`;

export const CardMain = styled.div`
  display: flex;
  flex: 1;
`;

export const CardImg = styled.div`
  display: flex;
  font-size: 2rem;
  flex: 0.5;

  img {
    width: 160px;
    height: 90px;
    margin-right: 1rem;
  }

  input[type='checkbox'] {
    zoom: 1.5;
    cursor: pointer;
  }
`;

export const CardPrice = styled.div`
  flex: 0.25;
  font-size: 2rem;
  display: flex;
  justify-content: flex-end;
`;

export const CardButtons = styled.div`
  flex: 0.25;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  button {
    width: 50%;
    height: 3vh;
    margin-bottom: 0.5rem;

    &:hover {
      background-color: #0a84d2;
      color: white;
    }
  }
`;
