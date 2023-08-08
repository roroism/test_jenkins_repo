import SouthKoreaFlagImg from '@app/public/media/south-korea-32.png';
import UnitedKingdomFlagImg from '@app/public/media/united-kingdom-32.png';
import JapanFlagImg from '@app/public/media/japan-32.png';
import GermanyFlagImg from '@app/public/media/germany-32.png';

export interface LanguageType {
  title: string;
  value: 'ko' | 'en' | 'de' | 'ja';
  imgSrc: string;
}

const languageList: LanguageType[] = [
  {
    title: '한국어',
    value: 'ko',
    imgSrc: SouthKoreaFlagImg,
  },
  {
    title: 'English',
    value: 'en',
    imgSrc: UnitedKingdomFlagImg,
  },
  {
    title: 'Deutsch',
    value: 'de',
    imgSrc: JapanFlagImg,
  },
  {
    title: '日本語',
    value: 'ja',
    imgSrc: GermanyFlagImg,
  },
];

export default languageList;
