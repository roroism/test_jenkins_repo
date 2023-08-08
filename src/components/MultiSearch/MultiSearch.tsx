import React, { useState } from 'react';
import * as Page from '@app/src/components/Page.style';
import axios from 'axios';

type MultiSearchProps = {
  multiSearchApply: Function;
};

export const MultiSearch = (props: MultiSearchProps) => {
  const category = [
    { big: '음식', middle: ['한식', '양식', '중식', '일식', '동남아식', '분식', '패스트푸드'] },
    { big: '의류', middle: ['상의', '하의', '모자', '데님', '아우터'] },
    { big: '주점', middle: ['소주', '맥주', '막걸리', '전통주', '와인'] },
    { big: '여행', middle: ['국내', '해외'] },
    {
      big: '병원',
      middle: ['진단/질환', '임상검사', '방사선의학', '치과', '보건', '간호', '한의학', '동물병원'],
    },
    { big: '헬스', middle: ['유산소 운동', '무산소 운동', '컨디셔닝운동', '케어'] },
    { big: '스포츠', middle: ['구기종목', '라켓스포츠', '수상스포츠', '기계체조', '격기', '육상'] },
    { big: '카페', middle: ['커피', '라떼', '차', '과일', '디저트'] },
    { big: '뷰티', middle: ['화장품', '헤어', '페션'] },
    { big: '문화생활', middle: ['공연/전시', '도서', '영화', '음악감상'] },
    { big: '공공기관', middle: ['공기업', '준정부기관', '기타공공기관'] },
    { big: '마트', middle: ['대형마트', '슈퍼마켓', '창고형할인마트', '백화점'] },
    { big: '숙박', middle: ['호텔', '모텔', '펜션', '글램핑', '리조트', '게스트하우스', '한옥'] },
    { big: '교통', middle: ['대중교통', '비행기', '운송/선박'] },
    { big: '종교', middle: ['기독교', '불독', '천주교', '이슬람교', '힌두교'] },
  ];

  const moodObj = [
    '신나는',
    '즐거운',
    '슬픈',
    '잔잔한',
    '설레는',
    '고요한',
    '밝은',
    '깔끔한',
    '모던한',
    '귀여운',
    '세련된',
    '어두운',
    '선명한',
    '연한',
    '부드러운',
    '차분한',
    '진한',
    '평화로운',
    '지루한',
    '우울한',
    '역동적인',
    '답답한',
    '축제',
    '로맨틱',
    '열정적인',
    '시끄러운',
    '혼돈스러운',
    '무서운',
    '위급한',
    '단조로운',
    '고독한',
    '공허한',
    '낙관적',
    '비관적',
    '당황한',
    '따뜻한',
    '차가운',
  ];
  const styleObj = [
    '3D',
    '2D',
    '스케치',
    '파스텔',
    '사진',
    '동양화',
    '서양화',
    '네온',
    '고딕',
    '미래',
    '판타지',
    '클로즈업',
    '항공샷',
    '흑백',
    '영화',
    '드로잉',
    '어린아이그림',
    '스티커',
    '일러스트',
    '포스터',
    '캐릭터',
    '싸이버펑크',
  ];
  const sortObj = ['최신순', '다운로드순', '낮은 가격순', '높은 가격순'];
  // ---------------state------------------------
  const { multiSearchApply } = props;
  const [bigCategory, setBigCategory] = useState('');
  const [middleCategory, setMiddleCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [mood, setMood] = useState('');
  const [style, setStyle] = useState('');
  const [minLike, setMinLike] = useState(0);
  const [maxLike, setMaxLike] = useState(100);
  const [sort, setSort] = useState('');
  const [multiPresentationData, setMultiPresentationData] = useState([]);
  // ---------------function---------------------
  const settingCategory = (option, category) => {
    if (option === 'big') {
      setMiddleCategory('');
      if (bigCategory === category) setBigCategory('');
      if (bigCategory !== category) setBigCategory(category);
    } else {
      if (middleCategory === category) setMiddleCategory('');
      if (middleCategory !== category) setMiddleCategory(category);
    }
  };
  // const settingMaxPrice = (e) => {
  //   if (+e.target.value > (minPrice.length ? minPrice[0] : 0)) {
  //     setMaxPrice([+e.target.value]);
  //   }
  // };

  // const settingMinPrice = (e) => {
  //   if (+e.target.value < (maxPrice.length ? maxPrice[0] : 10000)) {
  //     setMinPrice([+e.target.value]);
  //   }
  // };
  const settingMaxPrice = (e) => {
    if (+e.target.value > minPrice) setMaxPrice(+e.target.value);
  };
  const settingMinPrice = (e) => {
    if (+e.target.value < maxPrice) setMinPrice(+e.target.value);
  };
  const settingMaxLike = (e) => {
    if (+e.target.value > minLike) setMaxLike(+e.target.value);
  };
  const settingMinLike = (e) => {
    if (+e.target.value < maxLike) setMinLike(+e.target.value);
  };

  return (
    <Page.MultifacetedSearch>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>카테고리</Page.MultifacetedSearchTitle>
        <Page.MultifacetedSearchDetail style={{ alignItems: 'start' }}>
          {category.map((x) => (
            <>
              <Page.BigCategoryList
                onClick={() => settingCategory('big', x.big)}
                selected={bigCategory === x.big ? true : false}
              >
                <Page.Arrow selected={bigCategory === x.big ? true : false} />
                {x.big}
              </Page.BigCategoryList>
              {x.big === bigCategory ? (
                <Page.MiddleStage>
                  {category
                    .find((category) => category.big === bigCategory)
                    ?.middle.map((middle) => {
                      return (
                        <Page.MiddleCategoryList
                          onClick={() => settingCategory('middle', middle)}
                          selected={middleCategory === middle ? true : false}
                        >
                          {middle}
                        </Page.MiddleCategoryList>
                      );
                    })}
                </Page.MiddleStage>
              ) : null}
            </>
          ))}
        </Page.MultifacetedSearchDetail>
      </Page.MultifacetedSearchBox>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>가격</Page.MultifacetedSearchTitle>
        <Page.RangeBarWrap>
          <Page.Slider>
            <Page.Progress />
          </Page.Slider>
          <Page.BarWrap>
            <Page.Bar
              onChange={settingMinPrice}
              value={minPrice}
              type='range'
              min={0}
              max={10000}
              step={500}
            />
            <Page.Bar
              onChange={settingMaxPrice}
              value={maxPrice}
              type='range'
              min={0}
              max={10000}
              step={500}
            />
          </Page.BarWrap>
          <Page.PriceMsg>
            <Page.RangeNumberDiv>{minPrice}원</Page.RangeNumberDiv> ~{' '}
            <Page.RangeNumberDiv>{maxPrice}원</Page.RangeNumberDiv>
          </Page.PriceMsg>
        </Page.RangeBarWrap>
      </Page.MultifacetedSearchBox>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>분위기별</Page.MultifacetedSearchTitle>
        <Page.MultifacetedSearchDetail style={{ flexFlow: 'wrap' }}>
          {moodObj.map((x) => {
            return (
              <Page.MultifacetedSearchDetailDiv
                key={x}
                onClick={() => (mood !== x ? setMood(x) : setMood(''))}
                selected={mood === x ? true : false}
              >
                {x},
              </Page.MultifacetedSearchDetailDiv>
            );
          })}
        </Page.MultifacetedSearchDetail>
      </Page.MultifacetedSearchBox>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>스타일</Page.MultifacetedSearchTitle>
        <Page.MultifacetedSearchDetail style={{ flexFlow: 'wrap' }}>
          {styleObj.map((x) => {
            return (
              <Page.MultifacetedSearchDetailDiv
                key={x}
                onClick={() => (style !== x ? setStyle(x) : setStyle(''))}
                selected={style === x ? true : false}
              >
                {x},
              </Page.MultifacetedSearchDetailDiv>
            );
          })}
        </Page.MultifacetedSearchDetail>
      </Page.MultifacetedSearchBox>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>좋아요</Page.MultifacetedSearchTitle>
        <Page.RangeBarWrap>
          <Page.Slider>
            <Page.Progress />
          </Page.Slider>
          <Page.BarWrap>
            <Page.Bar
              onChange={settingMinLike}
              value={minLike}
              type='range'
              min='0'
              max='100'
              step='5'
            />
            <Page.Bar
              onChange={settingMaxLike}
              value={maxLike}
              type='range'
              min='0'
              max='100'
              step='5'
            />
          </Page.BarWrap>
          <Page.PriceMsg>
            <Page.RangeNumberDiv>{minLike}개</Page.RangeNumberDiv> ~{' '}
            <Page.RangeNumberDiv>{maxLike}개</Page.RangeNumberDiv>
          </Page.PriceMsg>
        </Page.RangeBarWrap>
      </Page.MultifacetedSearchBox>
      <Page.MultifacetedSearchBox>
        <Page.MultifacetedSearchTitle>정렬방법</Page.MultifacetedSearchTitle>
        <Page.MultifacetedSearchDetail style={{ alignItems: 'start' }}>
          {sortObj.map((x) => {
            return (
              <Page.MultifacetedSearchDetailDiv
                onClick={() => (sort !== x ? setSort(x) : setSort(''))}
                style={{ width: '100%' }}
                selected={sort === x ? true : false}
              >
                {x}
              </Page.MultifacetedSearchDetailDiv>
            );
          })}
        </Page.MultifacetedSearchDetail>
      </Page.MultifacetedSearchBox>
      <Page.ApplyBtn
        onClick={() =>
          multiSearchApply(
            bigCategory,
            middleCategory,
            minPrice,
            maxPrice,
            mood,
            minLike,
            maxLike,
            style,
            sort,
            1
          )
        }
      >
        적용하기
      </Page.ApplyBtn>
    </Page.MultifacetedSearch>
  );
};
