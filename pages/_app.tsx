import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import Head from 'next/head';

import { blueGrey } from '@mui/material/colors'

export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  const [mode,setMode]=  React.useState('dark');
  let theme:any;
  React.useEffect(() => {
   
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const m=  darkModeQuery.matches ? 'dark' : 'light';
    setMode(m);
      console.log("SET MODE",m)
      document.body.setAttribute("data-theme", m); 
  }, []);
  if(mode=='dark'){
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