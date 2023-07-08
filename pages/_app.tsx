import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react"
import Head from 'next/head';
//import theme from '../src/theme';
import { palette } from '../lib/palette';
import { blueGrey } from '@mui/material/colors'
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: blueGrey[900],
      paper: blueGrey[600],
    },
  },
})
export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  return (
    <React.Fragment>
      <Head>
        <title>Next App</title>
        <link href="/favicon.ico" rel="icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SessionProvider session={session}>
        <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}
