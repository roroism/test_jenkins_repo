import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SignUpForm } from './SignUpForm';
import { Terms } from './Terms';

export function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth/signup/terms');
  }, []);

  return (
    <Routes>
      <Route path="/auth/signup/terms" element={<Terms />} />
      <Route path="/auth/signup/form" element={<SignUpForm />} />
    </Routes>
  );
}
