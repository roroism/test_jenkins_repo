import { APIList } from '@app/src/apis';
import { faChevronDoubleLeft } from '@fortawesome/pro-regular-svg-icons/faChevronDoubleLeft';
import { faChevronDoubleRight } from '@fortawesome/pro-regular-svg-icons/faChevronDoubleRight';
import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight';
import React from 'react';
import * as S from './Pagination.style';

type PaginationProps = {
  paginationInfo: APIList['pages'];
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
};

export function Pagination(props: PaginationProps) {
  const { paginationInfo: info, maxVisiblePages = 5, onPageChange } = props;

  const firstPage = Math.ceil(info.current / maxVisiblePages - 1) * maxVisiblePages + 1;
  const lastPage = Math.min(firstPage + maxVisiblePages - 1, info.total);
  const pages = new Array(lastPage - firstPage + 1).fill(0).map((_, i) => firstPage + i);
  const hasOverPrev = firstPage > 1;
  const hasOverNext = lastPage < info.total;

  const onOverPrevClick = () => {
    onPageChange(firstPage - 1);
  };

  const onPrevClick = () => {
    onPageChange(info.current - 1);
  };

  const onNextClick = () => {
    onPageChange(info.current + 1);
  };

  const onOverNextClick = () => {
    onPageChange(lastPage + 1);
  };

  return (
    <S.Container>
      <S.PaginateButton onClick={onOverPrevClick} disabled={!hasOverPrev}>
        <S.PaginateIcon icon={faChevronDoubleLeft} />
      </S.PaginateButton>
      <S.PaginateButton onClick={onPrevClick} disabled={!info.hasPrev}>
        <S.PaginateIcon icon={faChevronLeft} />
      </S.PaginateButton>
      <S.Pages>
        {pages.map((page) => (
          <S.Page key={page} onClick={() => onPageChange(page)} selected={page === info.current}>
            {page}
          </S.Page>
        ))}
      </S.Pages>
      <S.PaginateButton onClick={onNextClick} disabled={!info.hasNext}>
        <S.PaginateIcon icon={faChevronRight} />
      </S.PaginateButton>
      <S.PaginateButton onClick={onOverNextClick} disabled={!hasOverNext}>
        <S.PaginateIcon icon={faChevronDoubleRight} />
      </S.PaginateButton>
    </S.Container>
  );
}
