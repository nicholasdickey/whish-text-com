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
  

  const [darkMode, setDarkMode] = React.useState(session?.mode||true);

  const modeMe = (e:any) => {
    setDarkMode(!!e.matches);
  };
  console.log("_app:darkMode",darkMode,session?.mode||"")
  React.useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if(matchMedia.matches!=darkMode){
      const assigned = { ...Object.assign(session, {mode:matchMedia.matches}) }
      setTimeout(async () => {
      await axios.post(`/api/session/save`, { session: assigned });
      }, 1);
    }
    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", modeMe);

    return () => matchMedia.removeEventListener("change", modeMe);
  }, []);

  let theme:any;
  if(darkMode){
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
        <link rel="icon" href={darkMode ? "/wbLogo.png" : "/bwLogo.png"} sizes="64x63" type="image/png" />

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