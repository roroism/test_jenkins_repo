import React from 'react';
import { createContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectUserData } from '@app/src/store/slices/authSlice';
import languageList from './constants/languages';

const htmlElement = document.querySelector('html');
const languageData = {
  en: () => require('../resources/locales/en.json'),
  ko: () => require('../resources/locales/ko.json'),
  de: () => require('../resources/locales/de.json'),
  ja: () => require('../resources/locales/ja.json'),
};

const languageCodeToName = {};
languageList.forEach((language) => (languageCodeToName[language.value] = language.title));

export const LanguageContext = createContext({
  languageCode: 'en',
  changeLanguage: (languageCode: string) =>
    console.log('언어 변경에 실패하였습니다.', languageCode),
  languageName: 'English',
});

type ProviderProps = {
  children: React.ReactNode;
};

export function LanguageProvider(props: ProviderProps) {
  const userData = useSelector(selectUserData());
  const [language, setLanguage] = useState({
    languageCode: 'en',
    translations: {},
    languageName: 'English',
  });

  const changeLanguage = async (languageCodeCandidate: string) => {
    const languageCode = Object.keys(languageData).includes(languageCodeCandidate)
      ? languageCodeCandidate
      : 'ko';
    const translations = await languageData[languageCode]();
    const languageName = languageCodeToName[languageCode];

    setLanguage({ languageCode, translations, languageName });
    htmlElement?.setAttribute('lang', languageCode);
  };

  const safe_changeLanguage = async (languageCodeCandidate: string) => {
    if (languageCodeCandidate === language.languageCode) return;
    changeLanguage(languageCodeCandidate);
  };

  useEffect(() => {
    if (userData.id) {
      changeLanguage(userData.lang);
    } else {
      const languageCode = navigator.language.split(/[-_]/)[0];
      changeLanguage(languageCode);
    }
  }, [userData.id]);

  return (
    <IntlProvider locale={language.languageCode} messages={language.translations}>
      <LanguageContext.Provider
        value={{
          languageCode: language.languageCode,
          changeLanguage: safe_changeLanguage,
          languageName: language.languageName,
        }}
      >
        {props.children}
      </LanguageContext.Provider>
    </IntlProvider>
  );
}
