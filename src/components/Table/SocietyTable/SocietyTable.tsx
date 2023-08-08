import React from 'react';
import * as S from '../../DataTable.style';
import { THeadGrid, TBodyGrid, StyledLink } from './SocietyTable.style';
import { SocietyManagementAPIResponse } from '@app/src/apis/societyManagement';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export interface SocietyTablePropsType {
  headTitles: string[]; //table column title
  tableDataList: SocietyManagementAPIResponse[]; //table body data
}

/**
 * /groups page의 Society List Table
 */
const SocietyTable = ({ headTitles, tableDataList }: SocietyTablePropsType) => {
  return (
    <>
      <S.Table>
        <S.THead>
          <S.THeadTr sx={THeadGrid}>
            {headTitles.map((title, index) => (
              <S.Th key={`${title}-${index}`}>{title}</S.Th>
            ))}
          </S.THeadTr>
        </S.THead>
        <S.TBody>{tableDataList.map((row) => makeRow(row))}</S.TBody>
      </S.Table>
    </>
  );
};

// make table row component
const makeRow = (data: SocietyManagementAPIResponse) => {
  const managerList = data.users.filter((u) => u.level === 'MANAGER');

  return (
    <S.TBodyTr sx={TBodyGrid} key={data.id}>
      <S.Td>
        <StyledLink
          to={`/groups/${data.id}`}
          state={{
            id: data.id,
            societyName: data.name,
            users: data.users,
            categories: data.categories,
          }}
        >
          {data.name}
        </StyledLink>
      </S.Td>
      <S.Td>{managerList[0].displayName}</S.Td>
      <S.Td>
        <ul>
          {data.categories.map((c, index) => (
            <li key={`${c}-${index}`}>{c.categoryName}</li>
          ))}
        </ul>
      </S.Td>
      <S.Td>{dayjs(data.createdDate).format('YYYY-MM-DD')}</S.Td>
    </S.TBodyTr>
  );
};

export default SocietyTable;
