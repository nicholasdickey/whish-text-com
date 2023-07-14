import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import Head from 'next/head';
import useDarkMode from '../hooks/mode';
import { blueGrey } from '@mui/material/colors'
import axios from 'axios';

export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  //const mode= useDarkMode(session?.mode||true);
  

  
  return (
    <React.Fragment>
      <Head>
        <title>Wish Text Composer</title>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      
      </Head>
    
        <CssBaseline />
        <Component {...pageProps} />
        
    
    </React.Fragment>
  );
}
/**
 * 
 *    <SessionProvider session={session}>
 * </SessionProvider>
     
 */