import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
`;

export const Loading = styled.p`
  font-size: 3rem;
`;

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    font-size: 3rem;
    margin-bottom: 4rem;
  }
  button {
    width: 100%;
    height: 5rem;
    margin-bottom: 2rem;
    border-radius: 2rem;
    background-color: #3498db;
    cursor: pointer;
    color: white;
    font-size: 1.5rem;

    &:hover {
      background-color: #2980b9;
      color: black;
    }
  }
`;
