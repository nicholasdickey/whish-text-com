import React from 'react';
import styled from 'styled-components';
import { useSession, signIn, signOut } from "next-auth/react"

import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
} from 'react-social-login-buttons';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ResponsiveButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ResponsiveButton = styled.div`
  width: 100%;

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const Login = () => {
    const { data: session } = useSession()
    if (session) {
        return (
          <>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )
      }
  return (
    <Container>
      <ResponsiveButtonContainer>
        <ResponsiveButton>
          <FacebookLoginButton onClick={() => signIn()}/>
        </ResponsiveButton>
        <ResponsiveButton>
          <GoogleLoginButton />
        </ResponsiveButton>
        <ResponsiveButton>
          <TwitterLoginButton />
        </ResponsiveButton>
      </ResponsiveButtonContainer>
    </Container>
  );
};

export default Login;
