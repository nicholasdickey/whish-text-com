import * as React from 'react';
import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  
  return (
    <React.Fragment>    
        <Component {...pageProps} />
    </React.Fragment>
  );
}
