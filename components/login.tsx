import React, { useCallback, useState } from 'react';
import {
    LoginSocialGoogle,
    LoginSocialFacebook,
    LoginSocialTwitter,
    LoginSocialApple,
    IResolveParams,
  } from 'reactjs-social-login';
  
  import {
    FacebookLoginButton,
    GoogleLoginButton,
    TwitterLoginButton,
    AppleLoginButton,
  } from 'react-social-login-buttons';
  const Login = () => {
    const [provider, setProvider] = useState('');
    const [profile, setProfile] = useState<any>();

    const onLoginStart = useCallback(() => {
        alert('login start');
      }, []);
    const onLogoutSuccess = useCallback(() => {
        setProfile(null);
        setProvider('');
        alert('logout success');
      }, []);
      const onLogout = useCallback(() => {}, []);  
  }