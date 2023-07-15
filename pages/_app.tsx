import * as React from 'react';
import type { AppProps } from 'next/app';

export default function MyApp(props: AppProps) {
  const { Component, pageProps: { session, ...pageProps } } = props;
  
  return (
    <React.Fragment>    
        <Component {...pageProps} />
    </React.Fragment>
  );
}
