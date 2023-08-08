import { fetchSignUp } from '@app/src/apis/auth';
import { Alert } from '@app/src/components/Alert';
import { BaseNavBar } from '@app/src/components/BaseNavBar';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { LanguageContext } from '@app/src/LanguageProvider';
import { SelectChangeEvent } from '@mui/material';
import CublickLoginLogo from '@app/resources/cublickLoginLogo.svg';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailCheckDialog } from '../EmailCheckDialog';
import * as S from './SignUpForm.style';
import { countries } from '@app/src/constants/geography';
import { modulo } from '@app/src/utils';
export function SignUpForm() {
  const modalCtrl = useModal();
  const { t } = useTranslation();
  const { languageCode } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordSame, setPasswordSame] = useState('');
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [phone, setPhone] = useState('01044439010');
  const [countryCode, setCoutryCode] = useState(0); //index of the countries array. We cant use phone code, if 2 counties have same code it displays wrong country
  const phoneInput = useRef<HTMLInputElement>();
  const [address, setAddress] = useState({
    country: 'Korea, Republic of South Korea',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  });
  const [company, setCompany] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  const onAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const signUpApi = useMutation({
    mutationFn: () =>
      fetchSignUp({
        username: id,
        password: password,
        email: email + domain,
        phone: countries[countryCode].dial_code.concat(phone),
        address: address,
        defLanguage: languageCode,
        company: company,
      }),
    onError(error: AxiosError<any>) {
      const idMapper = {
        invalid_email: 'app-common.alert_invalid_email',
        available_email: 'app-common.alert_available_email',
        available_user: 'app-common.alert_available_user',
        wrong_email: 'app-common.alert_wrong_email',
        wrong_password: 'app-common.alert_worng_password',
        unavailable: 'app-common.alert_unavailable',
      };
      const id = idMapper[error.response.data.message];
      modalCtrl.open(<Alert id={id || 'app-common.alert_available_user'} />);
    },
  });

  const linkToSignIn = () => {
    navigate('/auth/signin');
  };

  const changeDomain = (e: SelectChangeEvent) => {
    setDomain(e.target.value);
  };

  const onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSamePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordSame(e.target.value);
  };
  const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };
  const onCoutryCodeChange = (e: SelectChangeEvent) => {
    setCoutryCode(Number(e.target.value));
    phoneInput.current.focus();
    console.log(phoneInput);
  };
  const onCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(e.target.value);
  };

  const saveEmailInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const validEmailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  const alphaNumericRegExp = new RegExp(/^[a-z0-9]+$/);
  const phoneRegex = /^[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/;
  const isIdLengthLessThan4 = id.length < 4;
  const isIdLengthMoreThan128 = id.length > 128;
  const isIdHasUppercaseLetter = id !== id.toLowerCase();
  const isIdAlphaNumeric = alphaNumericRegExp.test(id);
  const isPasswordLengthLessThan8 = password.length < 8;
  const isPasswordLenghMoreThan20 = password.length > 20;
  // const isPasswordAlphaNumeric = alphaNumericRegExp.test(password);
  const isPasswordConfirmSameToPassword = password === passwordSame;
  const isEmailValid = validEmailPattern.test(email + domain);
  const isPhoneValid = phoneRegex.test(phone);

  const isButtonDisable =
    isIdLengthLessThan4 ||
    isIdLengthMoreThan128 ||
    isIdHasUppercaseLetter ||
    !isIdAlphaNumeric ||
    isPasswordLengthLessThan8 ||
    isPasswordLenghMoreThan20 ||
    // !isPasswordAlphaNumeric ||
    !isPasswordConfirmSameToPassword ||
    !isEmailValid ||
    !isPhoneValid;

  const openEmailCheckDialog = () => {
    modalCtrl.open(<EmailCheckDialog targetEmail={email} />);
  };

  return signUpApi.isSuccess ? (
    <S.Container>
      <S.SuccessContent>
        <S.SuccessEmail>{email}</S.SuccessEmail>
        <S.SuccessText>{t('app-auth.register_text')}</S.SuccessText>
        <Layout.Box margin='20px 0px' textAlign='center'>
          <S.ToLogInButton onClick={openEmailCheckDialog}>
            {t('app-auth.login-page')}
          </S.ToLogInButton>
        </Layout.Box>
      </S.SuccessContent>
    </S.Container>
  ) : (
    <S.Container>
      <S.Content>
        <Layout.Box mt='5px' textAlign='center'>
          <S.BrandButton onClick={linkToSignIn}>
            <img className='brand-logo' src={CublickLoginLogo} />
          </S.BrandButton>
        </Layout.Box>
        <BaseNavBar languageChanger />
        <S.Form>
          <S.Title>{t('app-auth.signup')}</S.Title>
          {
            currentPage === 0 && (
              <>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='username'>{t('app-common.username')}</Form.Label>
                  {isIdLengthLessThan4 ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.id1')}</Form.ErrMsg>
                  ) : null}
                  {isIdLengthMoreThan128 ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.id2')}</Form.ErrMsg>
                  ) : null}
                  {isIdHasUppercaseLetter ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.id3')}</Form.ErrMsg>
                  ) : null}
                  {!isIdAlphaNumeric ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.id4')}</Form.ErrMsg>
                  ) : null}
                  <Form.Input
                    id='username'
                    onChange={onIdChange}
                    autoComplete='false'
                    autoCorrect='false'
                    autoFocus
                  />
                </Layout.Box>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='password'>{t('app-common.passwrod')}</Form.Label>
                  {isPasswordLengthLessThan8 ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.pw1')}</Form.ErrMsg>
                  ) : null}
                  {isPasswordLenghMoreThan20 ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.pw2')}</Form.ErrMsg>
                  ) : null}
                  {/* {!isPasswordAlphaNumeric ? ( //
              <Form.ErrMsg>{t('app-auth.err-msg.pw3')}</Form.ErrMsg>
            ) : null} */}
                  <Form.Input
                    id='password'
                    type='password'
                    onChange={onPasswordChange}
                    autoComplete='false'
                    autoCorrect='false'
                  />
                </Layout.Box>

                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='password-confirm'>
                    {t('app-common.password_same')}
                  </Form.Label>
                  {password !== password ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.pw4')}</Form.ErrMsg>
                  ) : null}
                  {password === passwordSame ? ( //
                    <Form.PassMsg>{t('app-auth.succ-msg.pw')}</Form.PassMsg>
                  ) : null}
                  <Form.Input
                    id='password-confirm'
                    type='password'
                    error={password !== passwordSame}
                    onChange={onSamePasswordChange}
                    minLength={4}
                    maxLength={128}
                    autoComplete='false'
                    autoCorrect='false'
                  />
                </Layout.Box>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='e-mail'>{t('app-common.email')}</Form.Label>
                  {!isEmailValid ? ( //
                    <Form.ErrMsg>{t('app-common.alert_invalid_email')}</Form.ErrMsg>
                  ) : null}
                  <Layout.Box display='flex'>
                    <S.EmailInput
                      onChange={saveEmailInfo}
                      id='e-mail'
                      minLength={4}
                      maxLength={128}
                      autoComplete='false'
                      autoCorrect='false'
                    />
                    <S.Select color='secondary' value={domain} onChange={changeDomain}>
                      <Form.Option value=''>{t('app-auth-email-self')}</Form.Option>
                      <Form.Option value='@naver.com'>@naver.com</Form.Option>
                      <Form.Option value='@gmail.com'>@gmail.com</Form.Option>
                      <Form.Option value='@icloud.com'>@icloud.com</Form.Option>
                      <Form.Option value='@hanmail.net'>@hanmail.net</Form.Option>
                      <Form.Option value='@nate.com'>@nate.com</Form.Option>
                      <Form.Option value='@kakao.com'>@kakao.com</Form.Option>
                      <Form.Option value='@yahoo.com'>@yahoo.com</Form.Option>
                      <Form.Option value='@hotmail.com'>@hotmail.com</Form.Option>
                    </S.Select>
                  </Layout.Box>
                </Layout.Box>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='phone'>{t('app-common.phone')}</Form.Label>
                  {!isPhoneValid ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.phone')}</Form.ErrMsg>
                  ) : null}
                  <Layout.Box display='flex'>
                    <S.Select color='secondary' value={countryCode} onChange={onCoutryCodeChange}>
                      {countries.map((i, index) => (
                        <Form.Option value={index}>
                          {i.flag} {i.dial_code}
                        </Form.Option>
                      ))}
                    </S.Select>
                    <Form.Input
                      id='phone'
                      type='phone'
                      ref={phoneInput}
                      error={!isPhoneValid}
                      onChange={onPhoneChange}
                    />
                  </Layout.Box>
                </Layout.Box>
              </>
            )
            //end of 1st page
          }
          {
            currentPage === 1 && (
              <>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='country'>{t('app-common.country')}</Form.Label>
                  {!isPhoneValid ? ( //
                    <Form.ErrMsg>{t('app-auth.err-msg.phone')}</Form.ErrMsg>
                  ) : null}
                  <S.Select
                    id='country'
                    color='secondary'
                    value={address.country}
                    name='country'
                    onChange={onAddressChange}
                  >
                    {countries.map((i, index) => (
                      <Form.Option value={i.name}>
                        {i.flag} {i.name}
                      </Form.Option>
                    ))}
                  </S.Select>
                </Layout.Box>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='addressLine1'>{t('app-common.addressLine1')}</Form.Label>
                  <Form.Input
                    id='addressLine1'
                    name='addressLine1'
                    placeholder='addressLine1'
                    value={address.addressLine1}
                    onChange={onAddressChange}
                  />
                  <Form.Label htmlFor='addressLine2'>{t('app-common.addressLine2')}</Form.Label>
                  <Form.Input
                    id='addressLine2'
                    name='addressLine2'
                    placeholder='addressLine2'
                    value={address.addressLine2}
                    onChange={onAddressChange}
                  />
                  <Form.Label htmlFor='city'>{t('app-common.city')}</Form.Label>
                  <Form.Input
                    id='city'
                    name='city'
                    placeholder='city'
                    value={address.city}
                    onChange={onAddressChange}
                  />
                  <Form.Label htmlFor='state'>{t('app-common.state')}</Form.Label>
                  <Form.Input
                    id='state'
                    name='state'
                    placeholder='state'
                    value={address.state}
                    onChange={onAddressChange}
                  />
                  <Form.Label htmlFor='zip'>{t('app-common.zip')}</Form.Label>
                  <Form.Input
                    id='zip'
                    name='zip'
                    placeholder='zip'
                    value={address.zip}
                    onChange={onAddressChange}
                  />
                </Layout.Box>
                <Layout.Box mb='20px'>
                  <Form.Label htmlFor='company'>{t('app-common.company')} (optional)</Form.Label>
                  <Form.Input
                    id='company'
                    type='text'
                    onChange={onCompanyChange}
                    autoComplete='false'
                    autoCorrect='false'
                  />
                </Layout.Box>
              </>
            )
            //end of 2nd page
          }
          {/* 이메일 전송 버튼 */}

          <Layout.Box display='flex' justifyContent='center'>
            <S.BrandButton
              disabled={currentPage === 0}
              onClick={() => {
                setCurrentPage((prev) => modulo(prev + 1, totalPages));
              }}
            >
              Previous Page
            </S.BrandButton>
            <S.BrandButton
              disabled={currentPage === totalPages - 1}
              onClick={() => {
                setCurrentPage((prev) => modulo(prev + 1, totalPages));
              }}
            >
              Next Page
            </S.BrandButton>
          </Layout.Box>
          <S.SendButton onClick={() => signUpApi.mutate()} disabled={isButtonDisable}>
            {t('app-auth.send-email')}
          </S.SendButton>
        </S.Form>
        <Layout.Box margin='20px 0px' textAlign='center'>
          <S.ToLogInButton onClick={linkToSignIn}>{t('app-auth.login-page')}</S.ToLogInButton>
        </Layout.Box>
      </S.Content>
    </S.Container>
  );
}
