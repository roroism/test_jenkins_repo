import { css } from '@emotion/react';

export const GroupsListGrid = css`
  & > *:nth-of-type(1) {
    flex: 0 0 80px;
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 0 0 80px;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 150px;
    /* max-width: 100px; */
    text-align: center;
  }
  & > *:nth-of-type(4) {
    flex: 1 0 150px;
    text-align: center;
  }
  & > *:nth-of-type(5) {
    flex: 1 0 150px;
    text-align: center;
  }
  /* @media (max-width: 700px) {
    & > *:nth-of-type(5) {
      display: none;
    }
  } */
  & > *:nth-of-type(6) {
    flex: 1 0 150px;
    text-align: center;
  }
  & > *:nth-of-type(7) {
    flex: 0 0 160px;
    text-align: center;
  }
`;

// export const GroupsListGrid = css`
//   & > *:nth-of-type(1) {
//     flex: 1 0 80px;
//     text-align: center;
//   }
//   & > *:nth-of-type(2) {
//     flex: 1 0 150px;
//     text-align: center;
//   }
//   & > *:nth-of-type(3) {
//     flex: 1 0 150px;
//     /* max-width: 100px; */
//     text-align: center;
//   }
//   & > *:nth-of-type(4) {
//     flex: 1 0 150px;
//     text-align: center;
//   }
//   & > *:nth-of-type(5) {
//     flex: 1 0 150px;
//     text-align: center;
//   }
//   /* @media (max-width: 700px) {
//     & > *:nth-of-type(5) {
//       display: none;
//     }
//   } */
//   & > *:nth-of-type(6) {
//     flex: 1 0 150px;
//     text-align: center;
//   }
//   & > *:nth-of-type(7) {
//     flex: 0 0 160px;
//     text-align: center;
//   }
// `;
