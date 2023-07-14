import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import Head from 'next/head';
import useDarkMode from '../hooks/mode';
import { blueGrey } from '@mui/material/colors'

export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  const mode= useDarkMode();
  let theme:any;
  if(mode){
    theme = createTheme({
      palette: {
        mode: 'dark',
        background: {
          default:'#2d2b38',//' blueGrey[900],
          paper: blueGrey[600],
        },
        
      },
    })
  }
  else {
    theme = createTheme({
      palette: {
        mode: 'light',
        /*background: {
          default:'#2d2b38',//' blueGrey[900],
          paper: blueGrey[600],
        },*/
       
      },
    })
  }
  return (
    <React.Fragment>
      <Head>
        <title>Wish Text Composer</title>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        
      </ThemeProvider>
    </React.Fragment>
  );
}
/**
 * 
 *    <SessionProvider session={session}>
 * </SessionProvider>
     
 */